var app = require('express');
var router = app.Router();
var Caster = require('../models/caster.js');
var Event = require('../models/event.js');
var Link = require('../models/link.js');
var Map = require('../models/map.js');
var Match = require('../models/match.js');
var Module = require('../models/module.js');
var Organization = require('../models/organization.js');
var Round = require('../models/round.js');
var SocialMedia = require('../models/socialmedia.js')
var Sponsor = require('../models/sponsor.js');
var Team = require('../models/team.js');
var User = require('../models/user.js');

var async = require('async');

//This router is mounted at /api....so /events here translates to /api/events

router.get('/overview', function(req, res){
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
		},
		casters: function(callback){
			Caster.find().count(function(err, count){
				if(err) callback(err);
				else callback(null, count)
			});
		},
		
		maps: function(callback){
			Map.find().count(function(err, count){
				if(err) callback(err);
				else callback(null, count)
			});
		},
		
		teams: function(callback){
			Team.find().count(function(err, count){
				if(err) callback(err);
				else callback(null, count)
			});
		}

		//Add in user manager overview calls here.		

	}, function(err, results){
		if(err) console.warn(err);
		else res.json(results);
	});
});



//caster routes
router.route('/casters')
	.get(function(req, res) {
		Caster.find(function(err, casters) {
			if(err)
				console.log(err);
			res.json(casters);
		});
	})
	.post(function(req, res) {
	  console.log(req.body);
		Caster.create(req.body, function(err, casters) {
			if(err)
				res.send(err);
		});
	});

router.route('/casters/:caster_id')
	.delete(function(req, res) {
		Caster.remove({
			_id : req.params.caster_id
		}, function(err, caster) {
			if(err)
				res.send(err);
		});
	})
    .put(function(req, res) {
        Caster.findById(req.params.caster_id, function(err, caster) {
            if(err)
                res.send(err);
            caster = req.body;
            caster.save(function(err) {
                if(err)
                    res.send(err);
            });
        });
    });



//event routes
router.route('/events')
	.get(function(req, res) {
		Event.find(function(err, events) {
			if(err)
				console.log(err);
			res.json(events);
		});
	})
	.post(function(req, res) {
		Event.create(req.body, function(err, events) {
			if(err)
				res.send(err);
		});
	});

router.route('/events/:event_id')
	.delete(function(req, res) {
		Event.remove({
			_id : req.params.event_id
		}, function(err, event) {
			if(err)
				res.send(err);
		});
	})
    .put(function(req, res) {
        Event.findById(req.params.event_id, function(err, event) {
            if(err)
                res.send(err);
            event = req.body;
            event.save(function(err) {
                if(err)
                    res.send(err);
            });
        });
    });



//link routes
router.route('/link')
	.get(function(req, res) {
		Link.find(function(err, link) {
			if(err)
				console.log(err);
			res.json(events);
		});
	})
	.post(function(req, res) {
		Link.create(req.body, function(err, link) {
			if(err)
				res.send(err);
		});
	});

router.route('/link/:link_id')
	.delete(function(req, res) {
		Link.remove({
			_id : req.params.event_id
		}, function(err, event) {
			if(err)
				res.send(err);
		});
	})
    .put(function(req, res) {
        Link.findById(req.params.link_id, function(err, link) {
            if(err)
                res.send(err);
            link = req.body;
            link.save(function(err) {
                if(err)
                    res.send(err);
            });
        });
    });



//map routes
router.route('/map')
    .get(function(req, res) {
        Map.find(function(err, map) {
            if(err)
                console.log(err);
            res.json(map);
        });
    })
    .post(function(req, res) {
        Map.create(req.body, function(err, map) {
            if(err)
                res.send(err);
        });
    });

router.route('/map/:map_id')
    .delete(function(req, res) {
		Map.remove({
			_id : req.params.map_id
		}, function(err, map) {
			if(err)
				res.send(err);
		});
	})
    .put(function(req, res) {
        Map.findById(req.params.map_id, function(err, map) {
          if(err)
              res.send(err)
            map = req.body;
            map.save(function(err) {
               if(err)
                   res.send(err);
            });
        });
    })



//match routes
router.route('match')
    .get(function(req, res) {
        Match.find(function(err, match) {
            if(err)
                console.log(err);
            res.json(match);
        });
    })
    .post(function(req, res) {
        Match.creat(req.body, function(err, match) {
            if(err)
                res.send(err);
        });
    })

router.route('match/:match_id')
    .delete(function(req, res) {
        Match.remove({
            _id : req.param.match_id
        }, function(err, map) {
            if(err)
                res.send(err);
        });
    })
    .put(function(req, res) {
        Map.findById(req.params.map_id, function(err, map) {
            if(err)
                res.send(err)
            map = req.body;
            map.save(function(err) {
               if(err)
                   res.send(err);
            });
        });
    })

module.exports = router;
