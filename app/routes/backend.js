var app = require('express');
var router = app.Router();
var auth = require('../controllers/auth');
var User = require('../models/user');
var path = require('path');


router.all('/*', function (req, res, next) {
	// Dev logic, auto login user
	if (process.env.NODE_ENV === 'development' ) {
		if (!req.isAuthenticated()) {
			console.log('No user detected, trying to authenticate');
			User.authenticate()('simon_dev', 'password', function (err, user, options) {
				if (err) console.log(err);
				if (user === false) {
					console.log('ERROR: Set up dev admin account!');
				} else {
					req.login(user, function (err) {
						if (err) console.log(err);
						console.log('Dev login success!');
						res.locals.user = user;
						return next();
					});
				}
			});
		} else {
			res.locals.user = req.user;
			return next();
		}
	} else {
		res.locals.user = req.user;
		return next();
	}
});

router.get('/*', auth.updater(), function (req, res) {
	res.sendFile(path.resolve(__dirname + '/../../app/views/backend.html'));
});


module.exports = router;
