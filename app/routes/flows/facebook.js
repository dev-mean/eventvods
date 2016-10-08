var router = require('express').Router();
var User = require('../../models/user');
var config = require('../../../config/config');
var request = require('request');

function link_facebook(user, res, facebook_id, ret) {
	user.social.facebook = facebook_id;
	user.save(function(err) {
		if (err) next(err);
		res.redirect(ret);
	})
}

function process(req, res, body) {
	var logged_in = req.isAuthenticated();

	//Check Facebook isn't linked to any other accounts
	//and that account doesn't already have a facebook associated

	//Logged in and Facebook ID stored
	if (logged_in && typeof req.user.social.facebook === "string") {
		res.status('409').send('Please remove the Facebook account associated with your Eventvods account before attempting to add a new one.');

		//Logged in, no Facebook ID stored
	} else if (logged_in) {
		User.count({
			'social.facebook': body.id
		}, function(err, count) {
			if (err) next(err);
			if (count > 0)
				res.status('409').send('This Facebook account is associated linked to an Eventvods.com account. Please remove it before attempting to associate it with a new account.');
			else link_facebook(req.user, res, body.id, req.session.returnTo);
		});
	}
	//Else login w/ Facebook ID.
	else {
		User.findOne({
			'social.facebook': body.id
		}, function(err, user) {
			if (err) next(err);
			if(!user){
				var photo = body.picture.data.is_silhouette ? null : body.picture.data.url;
				req.session.flow_create = {
					social: {
						facebook: body.id
					},
					photo: photo
				};
				res.redirect('/register?flow_create=true&name='
					+ body.name
					+ '&email='
					+ body.email);
			}
			else req.login(user, function(err){
				if(err) next(err);
				else res.redirect('/');
			});
		});
	}
}

router.get('/', function(req, res, next) {
	req.session.returnTo = req.query.return || "/";
	res.redirect('https://www.facebook.com/dialog/oauth?client_id='
		+ config.social_login.facebook.id
		+ '&redirect_uri=https://beta.eventvods.com/login/facebook/complete/&scope=email');
});

router.get('/complete', function(req, res, next) {
	if (typeof req.query.error_reason !== "undefined")
		res.redirect('/login?error=' +
			req.query.error_description.replace('The user', 'You'));
	//Verify access token
	else if (typeof req.query.code === "string") {
		request('https://graph.facebook.com/v2.3/oauth/access_token?client_id='
			+ config.social_login.facebook.id
			+ '&redirect_uri=https://beta.eventvods.com/login/facebook/complete/&client_secret='
			+ config.social_login.facebook.secret
			+'&code=' + req.query.code,
			function(err, response, body) {
				console.log(err);
				if (err) next(err);
				body = JSON.parse(body);
				if (typeof body.error !== "undefined") res.json(body.error);
				//Access token is valid, request basic details
				else request('https://graph.facebook.com/me?access_token='
					+ body.access_token
					+'&fields=id,name,email,picture',
					function(err, response, body) {
					if (err) next(err);
					body = JSON.parse(body);
					if (typeof body.error !== "undefined") res.json(body.error);
					else process(req, res, body);
				});
			});
	}
});

router.get('/remove', function(req, res, next) {
	var logged_in = req.isAuthenticated();
	req.session.returnTo = req.query.return || "/";
	if (logged_in) {
		req.user.social.facebook = undefined;
		req.user.save(function(err) {
			if (err) next(err);
			else res.redirect(req.session.returnTo);
		})
	} else res.sendStatus('401');
});
module.exports = router;
