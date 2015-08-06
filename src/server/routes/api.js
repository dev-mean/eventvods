var app = require('express');
var router = app.Router();
var Caster = require('../models/caster.js');
var Event = require('../models/event.js');
var Map = require('../models/map.js');
var Match = require('../models/match.js');
var Module = require('../models/module.js');
var Organization = require('../models/organization.js');
var Player = require('../models/player.js');
var Round = require('../models/round.js');
var Series = require('../models/series.js');
var Sponsor = require('../models/sponsor.js');
var Team = require('../models/team.js');
var Tournament = require('../models/tournament.js');
var User = require('../models/user.js');

var async = require('async');

//This router is mounted at /api....so /events here translates to /api/events

router.get('/test', function(req, res){
	var d = new Date('2012-02-11T03:34:54.000Z');
	console.log(d);
	Event.find(
		{
			eventStartDate: d
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

//caster routes
router.get('/casters', function(req, res) {
	Caster.find(function(err, casters) {
		if(err)
			console.log(err);
		res.json(casters);
	});
});

router.post('/casters', function(req, res) {
  console.log(req.body);
	Caster.create(req.body, function(err, casters) {
		if(err)
			res.send(err);

/*		Caster.find(function(err, casters) {
			if(err)
				res.send(err);
			res.json(casters);
		});*/
	});
});


router.post('/casters/:caster_id', function(req, res) {
	Caster.remove({
		_id : req.params.caster_id
	}, function(err, caster) {
		if(err)
			res.send(err);

		Caster.find(function(err, casters) {
			if(err)
				res.send(err);
			res.json(events);
		});
	});
});

//event routes
router.get('/events', function(req, res) {
  Event.find(function(err, events) {
    if(err)
      console.log(err);
    res.json(events);
  });
});

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

router.post('/events/:event_id', function(req, res) {
	Event.remove({
		_id : req.params.event_id
	}, function(err, event) {
		if(err)
			res.send(err);

		Event.find(function(err, events) {
			if(err)
				res.send(err);
			res.json(events);
		});
	});
});

module.exports = router;