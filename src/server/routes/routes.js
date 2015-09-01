var app = require('express');
var router = app.Router();
var Event = require('../models/event');

var isAuthenticated = function(req, res, next) {
    if(process.env.NODE_ENV === 'development') return next();
    if(req.isAuthenticated()) return next();
    res.redirect('users/login');
};

// Sets up local user data for templating
router.all('/*', function(req, res, next) {
    if(process.env.NODE_ENV === 'development') {
        // Mock user data for dev so jade can compile properly if user isn't logged in
        res.locals.user = req.user || {_id:"55df72d695628e9e05593574", username:"devAdmin", userRights:0};
        return next();
    } 
    res.locals.user = req.user;
    next();
});

router.get('/', function(req, res) {
    res.render('overview', res.locals);
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