var app = require('express');
var router = app.Router();

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
        //Needs to send relevant event details
		var event = {};
        res.render('events/event', {
			data: event,
		});
});

router.get('/event/:id/edit', function(req, res) {
		//Needs to send relevant event details
		var event = {};
        res.render('events/form', {
			data: JSON.stringify(event), 
		});
});


//event api
router.get('/api/events', function(req, res) {
	Event.find(function(err, events) {
		if(err)
			res.send(err);
		res.json(events);
	});
});

//creates new event, should be fixed to accept all appropriate data, maybe more error handling stuff
router.post('/api/events', function(req, res) {
	Event.create({
		format : req.body.format,
		beginDate: new Date('Jun 07, 1954'),
		endDate: new Date('Jun 07, 1954'),
		tournamentLocation: req.body.tournamentLocation,
		casters: req.body.casters,
		panel: req.body.panel
	}, function(err, events) {
		if(err)
			res.send(err);

		Event.find(function(err, events) {
			if(err)
				res.send(err);
			res.json(events);
		});
	});
});

//deletes event object using the _id of specified object
router.post('/api/events/:event_id', function(req, res) {
	Event.remove({
		_id : req.params.event_id
	}, function(err, event) {
		if(err)
			res.send(err);

		Todo.find(function(err, events) {
			if(err)
				res.send(err);
			res.json(events);
		});
	});
});

module.exports = router;