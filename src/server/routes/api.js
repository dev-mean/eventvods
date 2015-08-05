var app = require('express');
var router = app.Router();
var Event = require('../models/event.js');
var async = require('async');

//This router is mounted at /api....so /events here translates to /api/events

router.get('/test', function(req, res){
	var d = new Date('2014-02-10T10:50:57.240Z');
	console.log(d);
	Event.find(
		{
			eventEndDate: d
		},
		function(err, events) {
		if(err)
			console.log(err);
		res.json(events);
	});
});

router.get('/overview', function(req, res){
	//Try block here for dev only
	try {
		var today = new Date().toISOString();
		async.parallel({
			upcoming: function(callback){
				Event.find({
					"eventStartDate": {
						$gte: today
					}
				}, function(err, docs){
					if(err) callback(err);
					else callback(null, docs);
				});
			},
			ongoing: function(callback){
				Event.find({
					"eventEndDate": {
						$gte: today
					},
					"eventStartDate": {
						$lte: today
					}
				}, function(err, docs){
					if(err) callback(err);
					else callback(null, docs);
				});
			},
			recent: function(callback){
				Event.find({
					"eventEndDate": {
						$lte: today
					}
				}, function(err, docs){
					if(err) callback(err);
					else callback(null, docs);
				});
			}
			
			//Add in data manager & user manager overview calls here.	
		
		}, function(err, results){
			if(err) console.warn(err);
			else res.json(results);
		})
	} catch(e) {
		console.warn(e);
	}
});

router.get('/events', function(req, res) {
	Event.find(function(err, events) {
		if(err)
			console.log(err);
		res.json(events);
	});
});

//creates new event, should be fixed to accept all appropriate data, maybe more error handling stuff
router.post('/events', function(req, res) {
	Event.create(req.body, function(err, events) {
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
router.post('/events/:event_id', function(req, res) {
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