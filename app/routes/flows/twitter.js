var router = require('express').Router();
var User = require('../../models/user');
var config = require('../../../config/config');
var Q = require('q');
var oauth = require('oauth');

var oa = new oauth.OAuth(
    "https://twitter.com/oauth/request_token", "https://twitter.com/oauth/access_token",
    config.social_login.twitter.id, config.social_login.twitter.secret,
	"1.0A", "http://beta.eventvods.com/login/twitter/complete", "HMAC-SHA1");

router.get('/', function(req, res, next) {
	oauth_request_token()
		.then(function(oa){
			req.session.oa_token = oa.token;
			req.session.oa_secret = oa.secret;
			res.redirect("https://twitter.com/oauth/authorize?oauth_token="+oa.token);
		})
		.catch(function(err){
			err = new Error("Error requesting OAuth token. This is probably an issue with Twitter. Please try again later.");
			next(err);
		})
});

router.get('/complete', function(req, res, next) {
	if(typeof req.query.denied === "string") res.redirect('/login');
	oauth_convert_token({
		oa_token: req.session.oa_token,
		oa_secret: req.session.oa_secret,
		oa_verif: req.query.oauth_verifier
	})
	.then(get_twitter_data)
	.then(function(twitterResponseData){
		process(req, res, twitterResponseData);
	})
	.catch(function(err){
		err = new Error("Error converting OAuth token. This is probably an issue with Twitter. Please try again later.");
		next(err);
	})
});

router.get('/remove', function(req, res, next) {
	var logged_in = req.isAuthenticated();
	if (logged_in) {
		req.user.social.twitter = undefined;
		req.user.save(function(err) {
			if (err) next(err);
			else res.sendStatus('204');
		})
	} else res.sendStatus('401');
});


function oauth_request_token(){
	var $promise = Q.defer();
	oa.getOAuthRequestToken(function (err, oAuthToken, oAuthTokenSecret) {
		if(err) $promise.reject(err);
		else $promise.resolve({
			token: oAuthToken,
			secret: oAuthTokenSecret
		});
	});
	return $promise.promise;
}
function oauth_convert_token(opts){
	var $promise = Q.defer();
	oa.getOAuthAccessToken(opts.oa_token, opts.oa_secret,
	opts.oa_verif, function(err, oauthAccessToken, oauthAccessTokenSecret, results) {
		if(err) $promise.reject(err);
		$promise.resolve({
			token: oauthAccessToken,
			secret: oauthAccessTokenSecret
		});
	});
	return $promise.promise;
}
function get_twitter_data(opts){
	var $promise = Q.defer();
	oa.get('https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
    opts.token, opts.secret, function (err, twitterResponseData, result) {
		if(err) $promise.reject(err);
		$promise.resolve(JSON.parse(twitterResponseData));
	});
	return $promise.promise;
}

function link_twitter(user, res, twitter_id) {
	user.social.twitter = twitter_id;
	user.save(function(err) {
		if (err) next(err);
		else res.redirect('/');
	});
}
function process(req, res, body) {
	var logged_in = req.isAuthenticated();

	//Check Twitter isn't linked to any other accounts
	//and that account doesn't already have a facebook associated

	//Logged in and Twitter ID stored
	if (logged_in && typeof req.user.social.twitter === "string") {
		res.status('409').send('Please remove the Twitter account associated with your Eventvods account before attempting to add a new one.');

	//Logged in, no Twitter ID stored
	} else if (logged_in) {
		User.count({
			'social.twitter': body.id
		}, function(err, count) {
			if (err) next(err);
			if (count > 0)
				res.status('409').send('This Twitter account is already linked to an Eventvods.com account. Please remove it before attempting to associate it with a new account.');
			else link_twitter(req.user, res, body.id);
		});
	}
	//Else login w/ Twitter ID.
	else {
		User.findOne({
			'social.twitter': body.id
		}, function(err, user) {
			if (err) next(err);
			if (!user) {
				req.session.flow_create = {
					social: {
						twitter: body.id
					},
					photo: body.profile_image_url_https
				};
				res.redirect('/register?flow_create=true&name=' +
					body.screen_name +
					'&email=' +
					body.email);
			} else req.login(user, function(err) {
				if (err) next(err);
				res.redirect('/');
			});
		});
	}
}
module.exports = router;
