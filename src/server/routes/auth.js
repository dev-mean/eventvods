var app = require('express');
var router = app.Router();

var User = require('../models/user.js');

router.route('/login')
	.get(function(req, res) {
		res.render('auth/login', {});
	})
	.post(function(req, res) {
		User.authenticate()(req.body.username, req.body.password, function(err, user, options) {
			if (err) res.json(err);
			if (user === false) {
				var err = {
					'status': 403,
					'message': 'Invalid username or password.'
				};
				res.json(err);
			} else {
				req.login(user, function(err) {
					res.redirect(req.session.returnTo || "/");
				});
			}
		})
	});

router.get('/logout', function(req, res) {
	req.logout();
	res.redirect("/");
});

router.route('/register')
	.get(function(req, res) {
		res.render('auth/register', {});
	})
	.post(function(req, res) {
		User.register(new User({
		username: req.body.username,
		userRights: 0,
	}), req.body.password, function(err, user) {
		if (err) {
			res.json(err);
		} else {
			req.login(user, function(err) {
				res.redirect(req.session.returnTo || "/");
			});
		}
		});
	});

module.exports = router;