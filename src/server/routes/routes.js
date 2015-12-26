var app = require('express');
var router = app.Router();
var auth = require('../controllers/auth');
var Event = require('../models/event');
var User = require('../models/user');

// Sets up local user data for templating
router.all('/*', function (req, res, next) {
	// Dev logic, auto login user
	if (process.env.NODE_ENV === 'development' || app.get('env') == 'development') {
		if (!req.isAuthenticated || !req.isAuthenticated()) {
			console.log('No user detected, trying to authenticate');
			User.authenticate()('devAdmin', 'test', function (err, user, options) {
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

router.get('/', auth.updater(), function (req, res) {
	res.render('overview', {});
});

router.get('/dashboard', auth.updater(), function (req, res) {
	res.render('overview', {});
});

router.get('/events', auth.updater(), function (req, res) {
	res.render('events/events', {});
});

router.get('/events/new', auth.updater(), function (req, res) {
	res.render('events/form', {});
});

router.get('/event/:id', auth.updater(), function (req, res) {
	var event = {};
	res.render('events/event', {
		data: event,
	});
});

router.get('/event/:id/edit', auth.updater(), function (req, res) {
	res.render('events/form', {
		eventID: req.params.id,
	});
});

router.get('/data', auth.updater(), function (req, res) {
	res.render('data/overview', {});
});

router.get('/data/new/:type', auth.updater(), function(req, res) {
    res.render('data/form/' + req.params.type, {});
});
    
router.get('/data/new', auth.updater(), function (req, res) {
	res.render('data/form/teams', {});
});

router.get('/data/casters', auth.updater(), function (req, res) {
	res.render('data/casters', {});
});

router.get('/data/maps', auth.updater(), function (req, res) {
	res.render('data/maps', {});
});

router.get('/data/teams', auth.updater(), function (req, res) {
	res.render('data/teams', {});
});

router.get('/data/:id', auth.updater(), function (req, res) {
	res.render('data/item', {});
});

router.get('/data/:id/edit', auth.updater(), function (req, res) {
	res.render('data/form', {});
});

router.get('/profile', auth.updater(), function (req, res) {
	res.render('user/profile', {});
});

router.get('/users', auth.updater(), function (req, res) {
	res.render('user/users', {});
});

module.exports = router;
