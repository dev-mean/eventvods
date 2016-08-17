var router = require('express').Router();
var User = require('../../models/user');
var Staff = require('../../models/staff');
var Team = require('../../models/team');
var auth = require('../../controllers/auth');
var ratelimit = require('../../controllers/ratelimit');
var cache = require('../../controllers/cache');
var moment = require('moment');
var async = require('async');
var League = require('../../models/league');
var Tournament = require('../../models/tournament');
var Article = require('../../models/article');

router.get('/', auth.public_api(), ratelimit, cache, function(req, res, next) {
	var today = moment()
		.format();
	async.parallel({
		staff: function(callback) {
			Staff.count(function(err, count) {
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
		articles: function(callback) {
			Article.count(function(err, count) {
				if (err) callback(err);
				else callback(null, count);
			});
		},
		completed: function(callback){
			async.parallel({
				leagues: function(cb){
					League.find({
						"endDate": {
							$lte: today
						}
					})
					.count()
					.exec(function(err, count) {
						if (err) cb(err);
						else cb(null, count);
					});
				},
				tournaments: function(cb){
					Tournament.find({
						"endDate": {
							$lte: today
						}
					})
					.count()
					.exec(function(err, count) {
						if (err) cb(err);
						else cb(null, count);
					});
				}
			}, function(err, data){
				if(err) callback(err);
				else callback(null, data.leagues + data.tournaments);
			});
		},
		leagues: function(callback){
			League.find({
					"startDate": {
						$lte: today
					},
					"endDate": {
						$gte: today
					}
				})
				.count()
				.exec(function(err, count) {
					if (err) callback(err);
					else callback(null, count);
				});
		},
		tournaments: function(callback){
			Tournament.find({
					"startDate": {
						$lte: today
					},
					"endDate": {
						$gte: today
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
						$gte: require('../../controllers/auth').constants.updater
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
						$gte: require('../../controllers/auth').constants.admin
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
