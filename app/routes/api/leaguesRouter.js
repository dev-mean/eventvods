var router = require('express').Router();
var League = require('../../models/league');
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
		League.find()
			.populate('game staff')
			.exec(function(err, leagues) {
				if (err) next(err);
				else res.json(leagues);
			});
	})
	.post(auth.updater(), AWS.handleUpload(['logo', 'header']), function(req, res, next) {
		req.body.startDate = Date.parse(req.body.startDate);
		req.body.endDate = Date.parse(req.body.endDate);
		Indicative.validateAll(req.body, Validators.league, Validators.messages)
			.then(function() {
				req.body.slug = slug(req.body.slug);
				League.create(req.body, function(err, league) {
					if (err) console.log(err);
					if (err) next(err);
					else res.json(league);
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
			err = new Error("League Not Found");
			err.status = 404;
			next(err);
		}
		League.find({
				game: game._id
			})
			.exec(function(err, leagues) {
				if (err) next(err);
				res.json(leagues);
			});
	});
});
router.get('/slug/:slug', auth.public_api(), ratelimit, cache, function(req, res, next) {
		League.findOne({
			slug: req.params.slug
		})
		.select('-_id -__v -textOrientation')
		.populate('game staff')
		.exec(function(err, leagues) {
			if (err) next(err);
			else res.json(leagues);
		});
	})
router.route('/:league_id')
	.get(auth.public_api(), ratelimit, cache, function(req, res, next) {
		League.findById(req.params.league_id)
			.populate('game staff')
			.exec(function(err, league) {
				if (err) next(err);
				if (!league) {
					err = new Error("League Not Found");
					err.status = 404;
					next(err);
				}
				res.json(league);
			});
	})
	.delete(auth.updater(), function(req, res, next) {
		League.findById(req.params.league_id, function(err, doc) {
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
		Indicative.validateAll(req.body, Validators.league, Validators.messages)
			.then(function() {
				req.body.slug = slug(req.body.slug);
				League.findByIdAndUpdate(req.params.league_id, req.body, function(err, league) {
					if (err) next(err);
					if (!league) {
						err = new Error("League not found");
						err.status = 404;
						next(err);
					} else res.json(league);
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
