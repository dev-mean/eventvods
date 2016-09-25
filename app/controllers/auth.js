var keygen = require('keygenerator');
var APIKey = require('../models/APIKey');
var config = require('../../config/config');
constants = {
	"end_user": 0,
	"logged_in": 1,
	"writer": 2,
	"updater": 3,
	"admin": 4,
	"dev": 5
};
module.exports.constants = constants;
module.exports.roles = [
	"Public User",
	"Registered User",
	"Writer",
	"Updater",
	"Administrator",
	"Developer"
];

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
	return res.redirect('/login');
}

function errorNoPermission(req, res, next) {
	var err = new Error("Insufficient Permission");
	err.status = 403;
	Error.captureStackTrace(err);
	res.use_express_redis_cache = false;
	next(err);
}

module.exports.logged_in = function(skipEmailCheck) {
	return function(req, res, next) {
		if (!req.isAuthenticated())
			loginRedirect(req, res);
		else if (req.user.emailConfirmed || skipEmailCheck)
			next();
		else
			res.redirect('/email');
	};
};
module.exports.writer = function(){
	return function(req, res, next) {
		if (!req.isAuthenticated())
			loginRedirect(req, res);
		else if (req.user.userRights >= constants.writer)
			next();
		else
			errorNoPermission(req, res, next);
	};
};
module.exports.updater = function() {
	return function(req, res, next) {
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

module.exports.public_api = function() {
	return function(req, res, next) {
		var key = req.query.apikey || req.get('X-Eventvods-Authorization');
		if (process.env.NODE_ENV == "development" ||
			(req.isAuthenticated() && req.user.userRights >= constants.author))
			return next();
		if (typeof key === "undefined" || key === null || key === "") {
			var err = new Error("Unauthorized - No API Key provided");
			err.status = 401;
			res.use_express_redis_cache = false;
			return next(err);
		}
		APIKey.count({
			apiKey: key
		}, function(err, count) {
			if (count > 0)
				next();
			else errorNoPermission(req, res, next);
		});
	};
}
