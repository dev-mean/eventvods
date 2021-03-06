var router = require('express').Router();
var Team = require('../../models/team');
var Game = require('../../models/game');
var auth = require('../../controllers/auth');
var ratelimit = require('../../controllers/ratelimit');
var AWS = require('../../controllers/aws');
var cache = require('../../controllers/cache');
var Indicative = require('indicative');
var Validators = require('../../controllers/validation');
router.route('/')
	.get(auth.public_api(), ratelimit, cache, function(req, res, next) {
		Team.find()
		.populate('game')
		.exec(function(err, teams) {
			if (err) next(err);
			res.json(teams);
		});
	})
	.post(auth.updater(), AWS.handleUpload(['icon']), function(req, res, next) {
		Indicative.validateAll(req.body, Validators.team, Validators.messages)
			.then(function() {
				Team.create(req.body, function(err, team) {
					if (err) next(err);
					res.json(team);
				});
			})
			.catch(function(errors) {
				var err = new Error("Bad Request");
				err.status = 400;
				err.errors = errors;
				next(err);
			});
	});
router.get('/slug/:slug', auth.public_api(), ratelimit, cache, function(req, res, next){
	Team.find({
		slug: req.params.slug
	})
	.populate('game')
	.fill('matches')
	.exec(function(err, teams) {
		if (err) next(err);
		res.json(teams);
	});
})
router.route('/:team_id')
	.delete(auth.updater(), function(req, res, next) {
		Team.findById(req.params.team_id, function(err, doc) {
			AWS.deleteImage(doc.icon)
				.then(function() {
					doc.remove(function(err) {
						if (err) next(err);
						else res.sendStatus(204);
					})
				}, function(err) {
					next(err);
				})
		});
	})
	.get(auth.public_api(), function(req, res, next) {
		Team.findById(req.params.team_id)
		.populate('game')
		.exec(function(err, team) {
			if (err) next(err);
			if (!team) {
				err = new Error("Team Not Found");
				err.status = 404;
				next(err);
			}
			res.json(team);
		});
	})
	.put(auth.updater(), AWS.handleUpload(['icon']), function(req, res, next) {
		Indicative.validateAll(req.body, Validators.team, Validators.messages)
			.then(function() {
				req.body.updatedAt = Date.now();
				Team.findByIdAndUpdate(req.params.team_id, req.body, function(err, team) {
					if (err) next(err);
					if (!team) {
						err = new Error("Team Not Found");
						err.status = 404;
						next(err);
					} else res.json(team);
				});
			})
			.catch(function(errors) {
				var err = new Error("Bad Request");
				err.status = 400;
				err.errors = errors;
				next(err);
			});
	});

module.exports = router;
