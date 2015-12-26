var keygen = require('keygenerator');
var APIKey = require('../models/APIKey');
constants = {
	"end_user": 0,
	"logged_in": 1,
	"updater": 2,
	"admin": 3
};
module.exports.constants = constants;

function key_generate_recurse(req, res) {
	var key = keygen._({
		length: 24,
		sticks: true
	});
	APIKey.count({
			apiKey: key
		},
		function (err, count) {
			if (err) next(err);
			if (count === 0) {
				APIKey.create({
					apiKeyOwner: {
						name: req.body.Name,
						email: req.body.Email,
						url: req.body.URL
					},
					apiKey: key
				}, function (err) {
					if (err) next(err);
					res.send(key);
				});
			} else key_generate_recurse(req, res);
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
//General check for 
module.exports.logged_in = function () {
	return function (req, res, next) {
		if (!req.isAuthenticated || !req.isAuthenticated())
			loginRedirect(req, res);
		else
			next();
	};
};
module.exports.updater = function () {
	return function (req, res, next) {
		if (!req.isAuthenticated || !req.isAuthenticated())
			loginRedirect(req, res);
		else if (req.user.userRights >= constants.updater)
			next();
		else
			errorNoPermission(req, res, next);
	};
};
module.exports.admin = function () {
	return function (req, res, next) {
		if (!req.isAuthenticated || !req.isAuthenticated())
			loginRedirect(req, res);
		else if (req.user.userRights >= constants.admin)
			next();
		else
			errorNoPermission(req, res, next);
	};
};

// Auth for API, doesn't try to redirect or anything fancy, as the user should never see these errors
module.exports.public_api = function () {
	return function (req, res, next) {
		//no api for now - just auto approve
		return next();
	};
};
//
module.exports.private_api = function () {
	return function (req, res, next) {
		errorNoPermission(req, res, next);
	};
};
