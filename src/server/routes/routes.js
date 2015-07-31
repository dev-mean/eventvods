var app = require('express').Router();

app.get('/', function(req, res) {
	res.render('overview', {});
});

//event api
app.get('/api/events', function(req, res) {
	Event.find(function(err, events) {
		if(err)
			res.send(err);
		res.json(events);
	});
});

//creates new event, should be fixed to accept all appropriate data, maybe more error handling stuff
app.post('/api/events', function(req, res) {
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
app.post('/api/events/:event_id', function(req, res) {
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

module.exports = app;