var router = require('express').Router();
var User = require('../../models/user');
var Event = require('../../models/event');
var Map = require('../../models/staff');
var Staff = require('../../models/map');
var Team = require('../../models/team');
var auth = require('../../controllers/auth');
var ratelimit = require('../../controllers/ratelimit');
var cache = require('../../controllers/cache');
var moment = require('moment');
var async = require('async');

router.get('/', auth.public_api(), ratelimit, cache, function(req, res, next) {
	var today = moment()
		.format();
	var last_week = moment()
		.subtract(7, 'days')
		.format();
	async.parallel({
		upcoming: function(callback) {
			Event.find({
					"eventStartDate": {
						$gte: today
					}
				})
				.sort('-eventStartDate')
				.limit(1)
				.exec(function(err, docs) {
					if (err) callback(err);
					else callback(null, docs);
				});
		},
		ongoing: function(callback) {
			Event.find({
					"eventEndDate": {
						$gte: today
					},
					"eventStartDate": {
						$lte: today
					}
				})
				.sort('eventStartDate')
				.exec(function(err, docs) {
					if (err) callback(err);
					else callback(null, docs);
				});
		},
		finished: function(callback) {
			Event.find({
					"eventEndDate": {
						$lte: today
					}
				})
				.sort('eventEndDate')
				.limit(1)
				.exec(function(err, docs) {
					if (err) callback(err);
					else callback(null, docs);
				});
		},
		staff: function(callback) {
			Staff.count(function(err, count) {
				if (err) callback(err);
				else callback(null, count);
			});
		},
		maps: function(callback) {
			Map.count(function(err, count) {
				if (err) callback(err);
				else callback(null, count);
			});
		},
		teams: function(callback) {
			Team.count(function(err, count) {
				if (err) callback(err);
				else callback(null, count);
			});
		},
		users: function(callback) {
			User.count(function(err, count) {
				if (err) callback(err);
				else callback(null, count);
			});
		},
		registrations: function(callback) {
			User.find({
					"signupDate": {
						$gte: last_week
					}
				})
				.count()
				.exec(function(err, count) {
					if (err) callback(err);
					else callback(null, count);
				});
		},
		updaters: function(callback) {
			User.find({
					"userRights": {
						$gte: 2
					}
				})
				.count()
				.exec(function(err, count) {
					if (err) callback(err);
					else callback(null, count);
				});
		},
		admins: function(callback) {
			User.find({
					"userRights": {
						$gte: 3
					}
				})
				.count()
				.exec(function(err, count) {
					if (err) callback(err);
					else callback(null, count);
				});
		},
	}, function(err, results) {
		if (err) next(err);
		else {
			res.json(results);
		}
	});
});

module.exports = router;