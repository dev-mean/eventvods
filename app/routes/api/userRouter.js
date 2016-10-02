var router = require('express').Router();
var User = require('../../models/user');
var auth = require('../../controllers/auth');
var Indicative = require('indicative');
var Validators = require('../../controllers/validation');
var email = require('../../controllers/email');
router.post('/displayName', auth.logged_in(true), function (req, res, next) {
	Indicative.validate(req.body, Validators.name, Validators.messages)
		.then(function () {
			User.findByIdAndUpdate(req.user._id, {
				displayName: req.body.Name.toUpperCase()
			}, function (err, user) {
				if (err) next(err);
				else res.sendStatus('204');
			});
		})
		.catch(function (err) {
			res.status('400').send(err);
		});

});
router.post('/following', auth.logged_in(true), function (req, res, next) {
	User.findByIdAndUpdate(req.user._id, {
		following: req.body
	}, function (err, user) {
		if (err) next(err);
		else res.sendStatus('204');
	});
});
router.post('/settings', auth.logged_in(true), function (req, res, next) {
	User.findByIdAndUpdate(req.user._id, {
		settings: req.body
	}, function (err, user) {
		if (err) next(err);
		else res.sendStatus('204');
	});
});
router.post('/email', auth.logged_in(true), function (req, res, next) {
	req.user.authenticate(req.body.confirm_pw, function (err, user, pwMessage) {
		if (err) next(err);
		if (!user) res.status('403').send('Incorrect password.');
		else if (Indicative.is.email(req.body.email)) {
			req.user.email = req.body.email;
			req.user.save(function (err) {
				if (err) next(err);
				else res.sendStatus('204');
			});
		} else res.status('400').send('Invalid email format/address.');
	});
});

router.get('/sendEmail', auth.logged_in(true), function (req, res, next) {
	User.findById(req.user._id, function (err, user) {
		if (err) next(err);
		else if (!user.emailConfirmation.sent) {
			email.sendVerification(user)
				.then(function () {
					user.emailConfirmation.sent = true;
					user.save(function (err) {
						if (err) next(err);
						else res.sendStatus('204');
					})
				})
		}
	});
});

router.get('/verify/:id/:code', auth.logged_in(true), function (req, res, next) {
	User.findById(req.user._id, function (err, user) {
		if (err) next(err);
		if (req.params.id != req.user._id) res.status('403').send('Authentication mismatch. Please make sure you\'re logged into the account before confirming your email');
		else if (req.params.code != user.code) res.status('400').send('Invalid confirmation code.');
		else {
			user.emailConfirmation.confirmed = true;
			user.save(function (err) {
				if (err) next(err);
				else res.redirect('/user/settings?tab=1');
			});
		}

	});
});

module.exports = router;
