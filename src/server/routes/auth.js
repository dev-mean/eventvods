var app = require('express');
var router = app.Router();
var auth = require('../controllers/auth.js');
var User = require('../models/user.js');
var Indicative = require('indicative');
var Validators = require('../controllers/validation.js');
var keygen = require('keygenerator');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('../config/config');

router.route('/login')
	.get(function (req, res, next) {
		res.render('user/login', {
			errors: []
		});
	})
	.post(function (req, res, next) {
		User.authenticate()(req.body.username, req.body.password, function (err, user, options) {
			if (err) next(err);
			if (user === false) {
				res.render('user/login', {
					errors: [
						"Invalid username or password."
					]
				});
			} else {
				user.lastLogin = Date.now();
				user.lastIP = req.ip;
				user.save();
				req.login(user, function (err) {
					res.redirect(req.session.returnTo || '/');
				});
			}
		});
	});

router.get('/logout', function (req, res, next) {
	req.logout();
	res.redirect('/');
});

router.route('/register')
	.get(function (req, res, next) {
		res.render('user/register', {
			errors: []
		});
	})
	.post(function (req, res, next) {
		Indicative
			.validateAll(req.body, Validators.register, Validators.messages)
			.then(function () {
				User.register(new User({
					username: req.body.Username,
					userRights: auth.constants.admin,
					userEmail: req.body.Email,
					signupIP: req.ip,
					emailConfirmed: false,
					emailConfirmation: keygen.number({
						length: 16
					}),
					emailSent: false
				}), req.body.Password, function (err, user) {
					if (err)
						next(err);
					else req.login(user, function (err) {
						if (err) next(err);
						else res.redirect('/user/verifyemail');
					});
				});
			})
			.catch(function (errors) {
				res.render('user/register', {
					errors: errors
				});
			});

	});
router.get('/verifyemail', auth.logged_in(true), function (req, res, next) {
	var transporter = nodemailer.createTransport(smtpTransport(config.smtp));
	//Please forgive me
	var mailOptions = {
		from: 'EventVODS.com <no-reply@eventvods.com>', // sender address 
		to: "", //list of receivers 
		subject: 'EventVODS Email Confirmation', // Subject line 
		text: 'Hello ' + req.user.username + ', \r\n\r\nThis is an automated email from EventVODS.com to confirm your email address.\r\nTo confirm your email address, please click here: http://eventvods.com/user/verifyemail/confirm/' + req.user.emailConfirmation + '\r\n\r\n Alternatively, you can visit http://eventvods.com/user/emailverify and manually enter your verification code below:\r\n' + req.user.emailConfirmation + '.\r\n\r\nThanks! - The EventVODS Team', // plaintext body 
		html: 'Hello ' + req.user.username + ', <br /><br />This is an automated email from EventVODS.com to confirm your email address.<br />To confirm your email address, please click here: <a href="http://eventvods.com/user/verifyemail/confirm/' + req.user.emailConfirmation + '">verify email</a>.<br /><br /> Alternatively, you can visit http://eventvods.com/user/emailverify and manually enter your verification code below:<br />' + req.user.emailConfirmation + '.<br /><br />Thanks! - The EventVODS Team' // html body 
	};
	User.findById(req.user._id, function (err, user) {
		res.locals.user = user;
		mailOptions.to = user.userEmail;
		if (!user.emailSent)
			transporter.sendMail(mailOptions, function (err, info) {
				if (err) next(err);
				else {
					user.emailSent = true;
					user.save(function (err) {
						if (err) next(err);
					});
					res.render('user/emailverify');
				}
			});
		else res.render('user/emailverify');
	});
});
router.post('/verifyemail/resend', auth.logged_in(true), function (req, res, next) {
	User.findById(req.user._id, function (err, user) {
		if (err) next(err);
		else {
			user.emailSent = false;
			user.save(function (err) {
				if (err) next(err);
				res.redirect('/user/verifyemail');
			});
		}
	});
});
router.post('/verifyemail/update', auth.logged_in(true), function (req, res, next) {
	if (Indicative.is.email(req.body.email))
		User.findById(req.user._id, function (err, user) {
			if (err) next(err);
			user.userEmail = req.body.email;
			user.emailSent = false;
			user.save(function (err) {
				if (err) next(err);
				res.redirect('/user/verifyemail');
			});
		});
	else {
		res.locals.user = req.user;
		res.render('user/emailverify', {
			emailError: true
		});
	}
});
router.get('/verifyemail/confirm/:confirmation', auth.logged_in(true), function (req, res, next) {
	User.findById(req.user._id, function (err, user) {
		if (err) next(err);
		if (user.emailConfirmation === req.params.confirmation) {
			user.emailConfirmed = true;
			user.save(function (err) {
				if (err) next(err);
				res.redirect('/user/verifyemail');
			});
		} else res.render('user/emailverify', {
			codeError: true
		});
	});
});
router.post('/verifyemail/confirm', auth.logged_in(true), function (req, res, next) {
	User.findById(req.user._id, function (err, user) {
		if (err) next(err);
		if (user.emailConfirmation === req.body.confirmation) {
			user.emailConfirmed = true;
			user.save(function (err) {
				if (err) next(err);
				res.redirect('/user/verifyemail');
			});
		} else res.render('user/emailverify', {
			codeError: true
		});
	});
});

// Simon todo: Password reset emails

module.exports = router;
