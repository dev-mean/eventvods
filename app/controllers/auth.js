var keygen = require('keygenerator');
var APIKey = require('../models/APIKey');
var config = require('../../config/config');
constants = {
	"end_user": 0,
	"logged_in": 1,
	"updater": 2,
	"admin": 3,
	"dev": 4
};
module.exports.constants = constants;

function key_generate_recurse(req, res, callback) {
	var key = keygen._({
		length: 24,
		sticks: true
	});
	APIKey.count({
			apiKey: key
		},
		function(err, count) {
			if (err) next(err);
			if (count === 0) {
				APIKey.create({
					apiKeyOwner: {
						name: req.body.Name,
						email: req.body.Email,
						url: req.body.URL
					},
					apiKey: key
				}, function(err, key) {
					if (err) callback(err);
					callback(null, key);
				});
			} else key_generate_recurse(req, res, callback);
		});
}
module.exports.generate_key = key_generate_recurse;

function loginRedirect(req, res) {
	if (req.session) {
		req.session.returnTo = req.originalUrl || req.url;
	}
	return res.redirect('/user/login');
}

function errorNoPermission(req, res, next) {
	var err = new Error("Insufficient Permission");
	err.status = 403;
	Error.captureStackTrace(err);
	next(err);
}

module.exports.logged_in = function(skipEmailCheck) {
	return function(req, res, next) {
		if (!req.isAuthenticated())
			loginRedirect(req, res);
		else if (req.user.emailConfirmed || skipEmailCheck)
			next();
		else
			res.redirect('/user/verifyemail');
	};
};
module.exports.updater = function() {
	return function(req, res, next) {
		console.log('Updater auth: ' + req.isAuthenticated());
		if (!req.isAuthenticated())
			loginRedirect(req, res);
		else if (req.user.userRights >= constants.updater)
			next();
		else
			errorNoPermission(req, res, next);
	};
};
module.exports.admin = function() {
	return function(req, res, next) {
		if (!req.isAuthenticated())
			loginRedirect(req, res);
		else if (req.user.userRights >= constants.admin)
			next();
		else
			errorNoPermission(req, res, next);
	};
};

// Auth for API, doesn't try to redirect or anything fancy, as the user should never see these errors
module.exports.public_api = function() {
	return function(req, res, next) {
		var key = req.query.apikey || req.get('X-Eventvods-Authorization');
		if (process.env.NODE_ENV == "development" ||
			(req.isAuthenticated && req.isAuthenticated() && req.user.userRights >= constants.updater))
			key = config.secret;
		if (typeof key === "undefined" || key === null || key === "") {
			var err = new Error("Unauthorized - No API Key provided");
			err.status = 401;
			res.use_express_redis_cache = false;
			return next(err);
		}
		req.apiKey = key;
		if (key == config.secret) {
			return next();
		}
		APIKey.count({
			apiKey: key
		}, function(err, count) {
			if (count > 0)
				next();
			else {
				err = new Error("Forbidden");
				err.status = 403;
				res.use_express_redis_cache = false;
				next(err);
			}
		});
	};
};
