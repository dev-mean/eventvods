var app = require('express');
var router = app.Router();
var auth = require('../controllers/auth');
var path = require('path');
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
var multer = require('multer');
var async = require('async');
var Validators = require('../controllers/validation');
var Indicative = require('indicative');
var APIKey = require('../models/APIKey');
var keygen = require('keygenerator');

// This router is mounted at /api....so /events here translates to /api/events

//basic api management



router.post('/key/generate', function (req, res, next) {
	Indicative
		.validateAll(req.body, Validators.apiRegister, Validators.messages)
		.then(function () {
			auth.generate_key(req, res);
		})
		.catch(function (errors) {
			var err = new Error("Bad Request");
			err.status = 400;
			err.errors = errors;
			next(err);
		});
});
router.get('/keys/list', function (req, res, next) {
	APIKey.find({}, function (err, keys) {
		console.log(keys);
	});
});



//api routes

router.get('/overview', function (req, res) {
	var today = new Date().toISOString();
	async.parallel({
		upcoming: function (callback) {
			Event.find({
					"eventStartDate": {
						$gte: today
					}
				})
				.sort('-eventStartDate')
				.limit(3)
				.exec(function (err, docs) {
					if (err) callback(err);
					else callback(null, docs);
				});
		},
		ongoing: function (callback) {
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
				.exec(function (err, docs) {
					if (err) callback(err);
					else callback(null, docs);
				});
		},
		recent: function (callback) {
			Event.find({
					"eventEndDate": {
						$lte: today
					}
				})
				.sort('eventEndDate')
				.limit(3)
				.exec(function (err, docs) {
					if (err) callback(err);
					else callback(null, docs);
				});
		},
		casters: function (callback) {
			Caster.find().count(function (err, count) {
				if (err) callback(err);
				else callback(null, count);
			});
		},

		maps: function (callback) {
			Map.find().count(function (err, count) {
				if (err) callback(err);
				else callback(null, count);
			});
		},

		teams: function (callback) {
			Team.find().count(function (err, count) {
				if (err) callback(err);
				else callback(null, count);
			});
		}

		//Add in user manager overview calls here.

	}, function (err, results) {
		if (err) next(err);
		else res.json(results);
	});
});



//Caster routes
router.route('/casters')
	.get(function (req, res) {
		Caster.find(function (err, casters) {
			if (err) next(err);
			res.json(casters);
		});
	})
	.post(function (req, res) {
		console.log(req.body);
		Caster.create(req.body, function (err, casters) {
			if (err) next(err);
		});
	});

router.route('/casters/:caster_id')
	.get(function (req, res) {
		Caster.findById(req.params.caster_id, function (err, casters) {
			if (err) next(err);
			res.json(casters);
		});
	})
	.delete(function (req, res) {
		Caster.remove({
			_id: req.params.caster_id
		}, function (err, caster) {
			if (err) next(err);
		});
	})
	.put(function (req, res) {
		Caster.findById(req.params.caster_id, function (err, caster) {
			if (err) next(err);
			caster = req.body;
			caster.save(function (err) {
				if (err) next(err);
			});
		});
	});



//Event routes
router.route('/events')
	.get(auth.public_api(), function (req, res) {
		Event.find(function (err, events) {
			if (err) next(err);
			else res.json(events);
		});
	})
	.post(function (req, res) {
		Event.create(req.body, function (err, event) {
			if (err) next(err);
			else res.status(200).json({
				'eventId': event._id
			});
		});
	});

router.route('/event/:event_id')
	.get(function (req, res) {
		Event.findById(req.params.event_id, function (err, event) {
			if (err) next(err);
			if (!event) {
				err = new Error("Event not found");
				err.status = 404;
				next(err);
			}
			res.json(event);
		});
	})
	.delete(function (req, res) {
		Event.remove({
			_id: req.params.event_id
		}, function (err, event) {
			if (err) next(err);
		});
	})
	.put(function (req, res) {
		Event.findByIdAndUpdate(req.params.event_id, req.body, function (err, event) {
			if (err) next(err);
			if (!event) {
				err = new Error("Event not found");
				err.status = 404;
				next(err);
			} else res.sendStatus(200);
		});
	});

//Link routes
router.route('/links')
	.get(function (req, res) {
		Link.find(function (err, link) {
			if (err) next(err);
			res.json(events);
		});
	})
	.post(function (req, res) {
		Link.create(req.body, function (err, link) {
			if (err) next(err);
		});
	});

router.route('/links/:link_id')
	.delete(function (req, res) {
		Link.remove({
			_id: req.params.event_id
		}, function (err, event) {
			if (err) next(err);
		});
	})
	.put(function (req, res) {
		Link.findById(req.params.link_id, function (err, link) {
			if (err) next(err);
			link = req.body;
			link.save(function (err) {
				if (err) next(err);
			});
		});
	});



//Map routes
router.route('/maps')
	.get(function (req, res) {
		Map.find(function (err, map) {
			if (err) next(err);
			res.json(map);
		});
	})
	.post(function (req, res) {
		Map.create(req.body, function (err, map) {
			if (err) next(err);
		});
	});

router.route('/maps/:map_id')
	.delete(function (req, res) {
		Map.remove({
			_id: req.params.map_id
		}, function (err, map) {
			if (err) next(err);
		});
	})
	.put(function (req, res) {
		Map.findById(req.params.map_id, function (err, map) {
			if (err) next(err);
			map = req.body;
			map.save(function (err) {
				if (err) next(err);
			});
		});
	});



//Match routes
router.route('/matches')
	.get(function (req, res) {
		Match.find(function (err, match) {
			if (err) next(err);
			res.json(match);
		});
	})
	.post(function (req, res) {
		Match.creat(req.body, function (err, match) {
			if (err) next(err);
		});
	});

router.route('/matches/:match_id')
	.delete(function (req, res) {
		Match.remove({
			_id: req.param.match_id
		}, function (err, map) {
			if (err) next(err);
		});
	})
	.put(function (req, res) {
		Map.findById(req.params.map_id, function (err, map) {
			if (err) next(err);
			map = req.body;
			map.save(function (err) {
				if (err) next(err);
			});
		});
	});

//Organization routes
router.route('/organizations')
	.get(function (req, res) {
		Organization.find(function (err, organizations) {
			if (err) next(err);
			res.json(organizations);
		});
	})
	.post(function (req, res) {
		organization.create(req.body, function (err, organizations) {
			if (err) next(err);
		});
	});

router.route('/organizations/:organization_id')
	.delete(function (req, res) {
		organization.remove({
			_id: req.params.organization_id
		}, function (err, organization) {
			if (err) next(err);
		});
	})
	.put(function (req, res) {
		organization.findById(req.params.organization_id, function (err, organization) {
			if (err) next(err);
			organization = req.body;
			organization.save(function (err) {
				if (err) next(err);
			});
		});
	});

//Round routes
router.route('/rounds')
	.get(function (req, res) {
		Round.find(function (err, rounds) {
			if (err) next(err);
			res.json(rounds);
		});
	})
	.post(function (req, res) {
		Round.create(req.body, function (err, rounds) {
			if (err) next(err);
		});
	});

router.route('/rounds/:round_id')
	.delete(function (req, res) {
		Round.remove({
			_id: req.params.round_id
		}, function (err, round) {
			if (err) next(err);
		});
	})
	.put(function (req, res) {
		Round.findById(req.params.round_id, function (err, round) {
			if (err) next(err);
			round = req.body;
			round.save(function (err) {
				if (err) next(err);
			});
		});
	});

//Social media routes
router.route('/socialmedia')
	.get(function (req, res) {
		SocialMedia.find(function (err, socialmedia) {
			if (err) next(err);
			res.json(socialmedia);
		});
	})
	.post(function (req, res) {
		SocialMedia.create(req.body, function (err, socialmedia) {
			if (err) next(err);
		});
	});

router.route('/socialmedia/:socialmedia_id')
	.delete(function (req, res) {
		SocialMedia.remove({
			_id: req.params.socialmedia_id
		}, function (err, socialmedia) {
			if (err) next(err);
		});
	})
	.put(function (req, res) {
		SocialMedia.findById(req.params.socialmedia_id, function (err, socialmedia) {
			if (err) next(err);
			socialmedia = req.body;
			socialmedia.save(function (err) {
				if (err) next(err);
			});
		});
	});

//Sponsor routes
router.route('/sponsors')
	.get(function (req, res) {
		Sponsor.find(function (err, sponsors) {
			if (err) next(err);
			res.json(sponsors);
		});
	})
	.post(function (req, res) {
		Sponsor.create(req.body, function (err, sponsors) {
			if (err) next(err);
		});
	});

router.route('/sponsors/:sponsor_id')
	.delete(function (req, res) {
		Sponsor.remove({
			_id: req.params.sponsor_id
		}, function (err, sponsor) {
			if (err) next(err);
		});
	})
	.put(function (req, res) {
		Sponsor.findById(req.params.sponsor_id, function (err, sponsor) {
			if (err) next(err);
			sponsor = req.body;
			sponsor.save(function (err) {
				if (err) next(err);
			});
		});
	});

//Team routes
router.route('/teams')
	.get(function (req, res) {
		Team.find(function (err, teams) {
			if (err) next(err);
			res.json(teams);
		});
	})
	.post(function (req, res) {
		Team.create(req.body, function (err, teams) {
			if (err) next(err);
		});
	});

router.route('/teams/:team_id')
	.delete(function (req, res) {
		Team.remove({
			_id: req.params.team_id
		}, function (err, team) {
			if (err) next(err);
		});
	})
	.put(function (req, res) {
		Team.findById(req.params.team_id, function (err, team) {
			if (err) next(err);
			team = req.body;
			team.save(function (err) {
				if (err) next(err);
			});
		});
	});

//Event module routes
router.route('/eventmodules')
	.get(function (req, res) {
		EventModule.find(function (err, eventmodules) {
			if (err) next(err);
			res.json(eventmodules);
		});
	})
	.post(function (req, res) {
		EventModule.create(req.body, function (err, eventmodules) {
			if (err) next(err);
		});
	});

router.route('/eventmodules/:eventmodule_id')
	.delete(function (req, res) {
		EventModule.remove({
			_id: req.params.eventmodule_id
		}, function (err, eventmodule) {
			if (err) next(err);
		});
	})
	.put(function (req, res) {
		EventModule.findById(req.params.eventmodule_id, function (err, eventmodule) {
			if (err)
				res.send(err);
			eventmodule = req.body;
			eventmodule.save(function (err) {
				if (err) next(err);
			});
		});
	});

// User stuff
router.route('/users')
	.get(function (req, res) {
		User.find({}, 'username userRights', function (err, users) {
			if (err) next(err);
			res.json(users);
		});
	})
	.post(function (req, res) {
		User.create(req.body, function (err, user) {
			if (err) next(err);
		});
	});

router.route('/users/:user_id')
	.get(function (req, res) {
		User.findById(req.params.user_id, 'username userRights', function (err, user) {
			if (err) next(err);
			res.json(user);
		});
	})
	.delete(function (req, res) {
		User.remove({
			_id: req.params.user_id
		}, function (err, user) {
			if (err) next(err);
		});
	})
	.put(function (req, res) {
		User.findById(req.params.user_id, function (err, user) {
			if (err) next(err);
			// Updates only the fields sent in the request(email, permissions, preferences)
			if (req.body.userEmail) user.userEmail = req.body.userEmail;
			if (req.body.userPreferences) user.userPreferences = req.body.userPreferences;
			if (req.body.userRights) user.useruserRights = req.body.useruserRights;
			user.save(function (err) {
				if (err) next(err);
			});
		});
	});

router.route('/images/events/:event_id')
	.post(image.upload.single('file'), function (req, res) {
		console.log("File uploaded for eventid " + req.params.event_id + ": " + req.file);
		return res.sendStatus(200);
	});


// 404 handler
router.use(function (req, res, next) {
	var err = new Error("Invalid API route");
	err.status = 404;
	next(err);
});

// prints stacktrace only in dev mode
router.use(function (err, req, res, next) {
	res.status(err.status || 500);
	console.log(err);

	if (process.env.NODE_ENV == "development" || app.get('env') == "development")
		res.json({
			"status": err.status,
			"message": err.message,
			"errors": err.errors,
			"stack": err.stack
		});
	else res.json({
		"status": err.status,
		"errors": err.errors,
		"message": err.message
	});

});
module.exports = router;
