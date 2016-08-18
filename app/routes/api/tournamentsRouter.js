var router = require('express').Router();
var Tournament = require('../../models/tournament');
var auth = require('../../controllers/auth');
var ratelimit = require('../../controllers/ratelimit');
var AWS = require('../../controllers/aws');
var cache = require('../../controllers/cache');
var Indicative = require('indicative');
var Validators = require('../../controllers/validation');
var Q = require('q');
var slug = require('slug');

router.route('/')
	.get(auth.public_api(), ratelimit, cache, function(req, res, next) {
		Tournament.find()
			.populate('staff')
			.exec(function(err, tournaments) {
				if (err) next(err);
				else res.json(tournaments);
			});
	})
	.post(auth.updater(), AWS.handleUpload(['logo', 'header']), function(req, res, next) {
		req.body.startDate = Date.parse(req.body.startDate);
		req.body.endDate = Date.parse(req.body.endDate);
		Indicative.validateAll(req.body, Validators.tournament, Validators.messages)
			.then(function() {
				req.body.slug = slug(req.body.slug);
				Tournament.create(req.body, function(err, tournament) {
					if (err) console.log(err);
					if (err) next(err);
					else res.json(tournament);
				});
			})
			.catch(function(errors) {
				var err = new Error("Bad Request");
				err.status = 400;
				err.errors = errors;
				next(err);
			});
	});
router.get('/game/:slug', auth.public_api(), ratelimit, cache, function(req, res, next) {
	Game.findOne({
		slug: req.params.slug
	}, function(err, game) {
		if (err) next(err);
		if (!game) {
			err = new Error("Tournament Not Found");
			err.status = 404;
			next(err);
		}
		Tournament.find({
				game: game._id
			})
			.exec(function(err, tournaments) {
				if (err) next(err);
				res.json(tournaments);
			});
	});
});
router.route('/:tournament_id')
	.get(auth.public_api(), ratelimit, cache, function(req, res, next) {
		Tournament.findById(req.params.tournament_id)
			.populate('staff')
			.exec(function(err, tournament) {
				if (err) next(err);
				if (!tournament) {
					err = new Error("Tournament Not Found");
					err.status = 404;
					next(err);
				}
				res.json(tournament);
			});
	})
	.delete(auth.updater(), function(req, res, next) {
		Tournament.findById(req.params.tournament_id, function(err, doc) {
			Q.all([AWS.deleteImage(doc.logo), AWS.deleteImage(doc.banner)])
				.then(function() {
					doc.remove(function(err) {
						if (err) next(err);
						else res.sendStatus(204);
					});
				}, function(err) {
					next(err);
				});
		});
	})
	.put(auth.updater(), AWS.handleUpload(['logo', 'header']), function(req, res, next) {
		req.body.startDate = Date.parse(req.body.startDate);
		req.body.endDate = Date.parse(req.body.endDate);
		Indicative.validateAll(req.body, Validators.tournament, Validators.messages)
			.then(function() {
				req.body.slug = slug(req.body.slug);
				Tournament.findByIdAndUpdate(req.params.tournament_id, req.body, function(err, tournament) {
					if (err) next(err);
					if (!tournament) {
						err = new Error("Tournament not found");
						err.status = 404;
						next(err);
					} else res.json(tournament);
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
