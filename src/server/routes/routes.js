var app = require('express');
var router = app.Router();
var Event = require('../models/event');

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
        Event.find
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

module.exports = router;