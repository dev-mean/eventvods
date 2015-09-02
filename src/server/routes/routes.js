var app = require('express');
var router = app.Router();
var Event = require('../models/event');
var User = require('../models/user.js');

var isAuthenticated = function(req, res, next) {
    // If environment is dev, skip authorization and authentication
    if (process.env.NODE_ENV === 'development') return next();
    if (!req.isAuthenticated()) res.redirect('users/login');
    return next();
};

// Sets up local user data for templating
router.all('/*', function(req, res, next) {
    // Dev logic, auto logs in user
    if (process.env.NODE_ENV === 'development') {
        if (!req.user) {
            console.log('No user detected, trying to authenticate');
            User.authenticate()('devAdmin', 'test', function(err, user, options) {
                if (err) console.log(err);
			    if (!user) {
				    console.log('ERROR: Set up dev admin account!');
			    } else {
				    req.login(user, function(err) {
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

// TODO: possibly change role checking to include multiple roles, strings, etc
var isAuthorized = function(role) {
    return function(req, res, next) {
        if (req.user.userRights === role)
            return next();
    };
};

router.get('/', function(req, res) {
    res.render('overview', {});
});

router.get('/dashboard', function(req, res) {
    res.render('overview', {});
});

router.get('/events', function(req, res) {
    res.render('events/events', {});
});

router.get('/events/new', function(req, res) {
    res.render('events/form', {});
});

router.get('/event/:id', function(req, res) {
	var event = {};
    res.render('events/event', {
		data: event,
	});
});

router.get('/event/:id/edit', function(req, res) {
    res.render('events/form', {
		eventID: req.params.id,
	});
});

router.get('/data', function(req, res) {
    res.render('data/overview', {});
});

router.get('/data/new', function(req, res) {
    res.render('data/form', {});
});

router.get('/data/casters', function(req, res) {
    res.render('data/casters', {});
});

router.get('/data/maps', function(req, res) {
    res.render('data/maps', {});
});

router.get('/data/teams', function(req, res) {
    res.render('data/teams', {});
});

router.get('/data/:id', function(req, res) {
    res.render('data/item', {});
});

router.get('/data/:id/edit', function(req, res) {
    res.render('data/datum', {});
});

router.get('/profile', function(req, res) {
    res.render('auth/profile', {}); 
});

module.exports = router;