var app = require('express');
var router = app.Router();
var image = require('../controllers/image');
var Caster = require('../models/caster');
var Event = require('../models/event');
var Link = require('../models/link');
var Map = require('../models/map');
var Match = require('../models/match');
var EventModule = require('../models/module');
var Organization = require('../models/organization');
var Round = require('../models/round');
var SocialMedia = require('../models/socialmedia');
var Sponsor = require('../models/sponsor');
var Team = require('../models/team');
var User = require('../models/user');

var async = require('async');

function api_error(code, message, errors, res){
	var err = {};
	err.message = message;
	err.errors = errors;
	return res.status(code).json(err);
}

// This router is mounted at /api....so /events here translates to /api/events

// Auth stuff
var isAuthenticated = function(req, res, next) {
    if (process.env.NODE_ENV === 'development') return next();
    if (req.isAuthenticated()) return next();
    res.sendStatus(401);
};

// TODO: maybe move this to another module?
var isAuthorized = function(role) {
    return function(req, res, next) {
        if (req.user.userRights === role)
            return next();
    };
};



router.get('/overview', function(req, res){
	var today = new Date().toISOString();
	async.parallel({
		upcoming: function(callback){
			Event.find({
				"eventStartDate": {
					$gte: today
				}
			})
			.sort('-eventStartDate')
			.limit(3)
			.exec(function(err, docs){
				if (err) callback(err);
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
			})
			.sort('eventStartDate')
			.limit(3)
			.exec(function(err, docs){
				if (err) callback(err);
				else callback(null, docs);
			});
		},
		recent: function(callback){
			Event.find({
				"eventEndDate": {
					$lte: today
				}
			})
			.sort('eventEndDate')
			.limit(3)
			.exec(function(err, docs){
				if (err) callback(err);
				else callback(null, docs);
			});
		},
		casters: function(callback){
			Caster.find().count(function(err, count){
				if (err) callback(err);
				else callback(null, count);
			});
		},
		
		maps: function(callback){
			Map.find().count(function(err, count){
				if (err) callback(err);
				else callback(null, count);
			});
		},
		
		teams: function(callback){
			Team.find().count(function(err, count){
				if (err) callback(err);
				else callback(null, count);
			});
		}

		//Add in user manager overview calls here.		

	}, function(err, results){
		if (err) console.warn(err);
		else res.json(results);
	});
});



//Caster routes
router.route('/casters')
	.get(function(req, res) {
		Caster.find(function(err, casters) {
			if (err)
				console.log(err);
			res.json(casters);
		});
	})
	.post(function(req, res) {
	  console.log(req.body);
		Caster.create(req.body, function(err, casters) {
			if (err)
				res.send(err);
		});
	});

router.route('/casters/:caster_id')
	.get(function(req, res) {
		Caster.findById(req.params.caster_id, function(err, casters) {
			if (err)
				console.log(err);
			res.json(casters);
		});
	})
	.delete(function(req, res) {
		Caster.remove({
			_id : req.params.caster_id
		}, function(err, caster) {
			if (err)
				res.send(err);
		});
	})
    .put(function(req, res) {
        Caster.findById(req.params.caster_id, function(err, caster) {
            if (err)
                res.send(err);
            caster = req.body;
            caster.save(function(err) {
                if (err)
                    res.send(err);
            });
        });
    });



//Event routes
router.route('/events')
	.get(function(req, res) {
		Event.find(function(err, events) {
			if (err)	api_error(500, 'Unknown error @ GET /api/events', {'message': 'Unknown error occured while fetching events.', 'path': 'GET /api/events', 'type': 'Database'}, res);
			else res.json(events);
		});
	})
	.post(function(req, res) {
		Event.create(req.body, function(err, event) {
			if (err){
				if (err.name == "ValidationError"){
					var errors = [];
					for(var i in err.errors)
						errors.push({'message': err.errors[i].message, 'path': err.errors[i].path, 'type': err.errors[i].kind});
					api_error(400, 'Event validation failed', errors, res);
				}
				else {
					api_error(500, 'Unknown error @ POST /api/events', {'message': 'Unknown error occured while adding a new event.', 'path': 'POST /api/events', 'type': 'Database'}, res);
				}
			}
			else res.status(200).json({'eventId': event._id});
		});
	});

router.route('/event/:event_id')
	.get(function(req, res){
			Event.findById(req.params.event_id, function(err, event) {
				if (err)
					return api_error(400, 'Invalid eventId format provided', {'message': req.params.event_id+' is an invalid id format.', 'path': 'GET /api/event/'+req.params.event_id, 'type': 'Database'}, res);
				if (!event)
					return api_error(404, 'Attempted to load non-existent event', {'message': 'Attempted to load event '+req.params.event_id+' which does not exist.', 'path': 'GET /api/event/'+req.params.event_id, 'type': 'Database'}, res);
				res.json(event);
			});
	})
	.delete(function(req, res) {
		Event.remove({
			_id : req.params.event_id
		}, function(err, event) {
			if (err)
				res.send(err);
		});
	})
    .put(function(req, res) {
        Event.findByIdAndUpdate(req.params.event_id, req.body, function(err, event) {
            if (err){
					if (err.name == "ValidationError"){
						var errors = [];
						for(var i in err.errors)
							errors.push({'message': err.errors[i].message, 'path': err.errors[i].path, 'type': err.errors[i].kind});
						api_error(400, 'Event validation failed', errors, res);
					}
					else return api_error(400, 'Invalid eventId format provided', {'message': req.params.event_id+' is an invalid id format.', 'path': 'PUT /api/event/'+req.params.event_id, 'type': 'Database'}, res);
			}
			if (!event) api_error(404, 'Attempted to update non-existent event', {'message': 'Attempted to update event '+req.params.event_id+' which does not exist.', 'path': 'PUT /api/event/'+req.params.event_id, 'type': 'Database'}, res);
			else res.sendStatus(200);
        });
    });



//Link routes
router.route('/links')
	.get(function(req, res) {
		Link.find(function(err, link) {
			if (err)
				console.log(err);
			res.json(events);
		});
	})
	.post(function(req, res) {
		Link.create(req.body, function(err, link) {
			if (err)
				res.send(err);
		});
	});

router.route('/links/:link_id')
	.delete(function(req, res) {
		Link.remove({
			_id : req.params.event_id
		}, function(err, event) {
			if (err)
				res.send(err);
		});
	})
    .put(function(req, res) {
        Link.findById(req.params.link_id, function(err, link) {
            if (err)
                res.send(err);
            link = req.body;
            link.save(function(err) {
                if (err)
                    res.send(err);
            });
        });
    });



//Map routes
router.route('/maps')
    .get(function(req, res) {
        Map.find(function(err, map) {
            if (err)
                console.log(err);
            res.json(map);
        });
    })
    .post(function(req, res) {
        Map.create(req.body, function(err, map) {
            if (err)
                res.send(err);
        });
    });

router.route('/maps/:map_id')
    .delete(function(req, res) {
		Map.remove({
			_id : req.params.map_id
		}, function(err, map) {
			if (err)
				res.send(err);
		});
	})
    .put(function(req, res) {
        Map.findById(req.params.map_id, function(err, map) {
          if (err)
              res.send(err);
            map = req.body;
            map.save(function(err) {
               if (err)
                   res.send(err);
            });
        });
    });



//Match routes
router.route('/matches')
    .get(function(req, res) {
        Match.find(function(err, match) {
            if (err)
                console.log(err);
            res.json(match);
        });
    })
    .post(function(req, res) {
        Match.creat(req.body, function(err, match) {
            if (err)
                res.send(err);
        });
    });

router.route('/matches/:match_id')
    .delete(function(req, res) {
        Match.remove({
            _id : req.param.match_id
        }, function(err, map) {
            if (err)
                res.send(err);
        });
    })
    .put(function(req, res) {
        Map.findById(req.params.map_id, function(err, map) {
            if (err)
                res.send(err);
            map = req.body;
            map.save(function(err) {
               if (err)
                   res.send(err);
            });
        });
    });

//Organization routes
router.route('/organizations')
	.get(function(req, res) {
		Organization.find(function(err, organizations) {
			if (err)
				console.log(err);
			res.json(organizations);
		});
	})
	.post(function(req, res) {
		organization.create(req.body, function(err, organizations) {
			if (err)
				res.send(err);
		});
	});

router.route('/organizations/:organization_id')
	.delete(function(req, res) {
		organization.remove({
			_id : req.params.organization_id
		}, function(err, organization) {
			if (err)
				res.send(err);
		});
	})
    .put(function(req, res) {
        organization.findById(req.params.organization_id, function(err, organization) {
            if (err)
                res.send(err);
            organization = req.body;
            organization.save(function(err) {
                if (err)
                    res.send(err);
            });
        });
    });

//Round routes
router.route('/rounds')
	.get(function(req, res) {
		Round.find(function(err, rounds) {
			if (err)
				console.log(err);
			res.json(rounds);
		});
	})
	.post(function(req, res) {
		Round.create(req.body, function(err, rounds) {
			if (err)
				res.send(err);
		});
	});

router.route('/rounds/:round_id')
	.delete(function(req, res) {
		Round.remove({
			_id : req.params.round_id
		}, function(err, round) {
			if (err)
				res.send(err);
		});
	})
    .put(function(req, res) {
        Round.findById(req.params.round_id, function(err, round) {
            if (err)
                res.send(err);
            round = req.body;
            round.save(function(err) {
                if (err)
                    res.send(err);
            });
        });
    });

//Social media routes
router.route('/socialmedia')
	.get(function(req, res) {
		SocialMedia.find(function(err, socialmedia) {
			if (err)
				console.log(err);
			res.json(socialmedia);
		});
	})
	.post(function(req, res) {
		SocialMedia.create(req.body, function(err, socialmedia) {
			if (err)
				res.send(err);
		});
	});

router.route('/socialmedia/:socialmedia_id')
	.delete(function(req, res) {
		SocialMedia.remove({
			_id : req.params.socialmedia_id
		}, function(err, socialmedia) {
			if (err)
				res.send(err);
		});
	})
    .put(function(req, res) {
        SocialMedia.findById(req.params.socialmedia_id, function(err, socialmedia) {
            if (err)
                res.send(err);
            socialmedia = req.body;
            socialmedia.save(function(err) {
                if (err)
                    res.send(err);
            });
        });
    });

//Sponsor routes
router.route('/sponsors')
	.get(function(req, res) {
		Sponsor.find(function(err, sponsors) {
			if (err)
				console.log(err);
			res.json(sponsors);
		});
	})
	.post(function(req, res) {
		Sponsor.create(req.body, function(err, sponsors) {
			if (err)
				res.send(err);
		});
	});

router.route('/sponsors/:sponsor_id')
	.delete(function(req, res) {
		Sponsor.remove({
			_id : req.params.sponsor_id
		}, function(err, sponsor) {
			if (err)
				res.send(err);
		});
	})
    .put(function(req, res) {
        Sponsor.findById(req.params.sponsor_id, function(err, sponsor) {
            if (err)
                res.send(err);
            sponsor = req.body;
            sponsor.save(function(err) {
                if (err)
                    res.send(err);
            });
        });
    });

//Team routes
router.route('/teams')
	.get(function(req, res) {
		Team.find(function(err, teams) {
			if (err)
				console.log(err);
			res.json(teams);
		});
	})
	.post(function(req, res) {
		Team.create(req.body, function(err, teams) {
			if (err)
				res.send(err);
		});
	});

router.route('/teams/:team_id')
	.delete(function(req, res) {
		Team.remove({
			_id : req.params.team_id
		}, function(err, team) {
			if (err)
				res.send(err);
		});
	})
    .put(function(req, res) {
        Team.findById(req.params.team_id, function(err, team) {
            if (err)
                res.send(err);
            team = req.body;
            team.save(function(err) {
                if (err)
                    res.send(err);
            });
        });
    });

//Event module routes
router.route('/eventmodules')
	.get(function(req, res) {
		EventModule.find(function(err, eventmodules) {
			if (err)
				console.log(err);
			res.json(eventmodules);
		});
	})
	.post(function(req, res) {
		EventModule.create(req.body, function(err, eventmodules) {
			if (err)
				res.send(err);
		});
	});

router.route('/eventmodules/:eventmodule_id')
	.delete(function(req, res) {
		EventModule.remove({
			_id : req.params.eventmodule_id
		}, function(err, eventmodule) {
			if (err)
				res.send(err);
		});
	})
    .put(function(req, res) {
        EventModule.findById(req.params.eventmodule_id, function(err, eventmodule) {
            if (err)
                res.send(err);
            eventmodule = req.body;
            eventmodule.save(function(err) {
                if (err)
                    res.send(err);
            });
        });
    });

// User stuff
router.route('/users')
	.get(function(req, res) {
		User.find({})
            .select('username userRights userPreferences')
            .exec(function(err, user) {
			if (err)
				console.log(err);
			res.json(user);
		});
	})
	.post(function(req, res) {
		User.create(req.body, function(err, user) {
			if (err)
				res.send(err);
		});
	});

router.route('/users/:user_id')
	.delete(function(req, res) {
		User.remove({
			_id : req.params.user_id
		}, function(err, user) {
			if (err)
				res.send(err);
		});
	})
    .put(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);
            user = req.body;
            user.save(function(err) {
                if (err)
                    res.send(err);
            });
        });
    });

router.route('/images/events/:event_id')
    .post(function(req, res) {
        image.saveImage(req, res);
    });
module.exports = router;
