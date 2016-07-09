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
			.populate('leagueGame')
			.exec(function(err, leagues) {
				if (err) next(err);
				else res.json(leagues);
			});
	})
	.post(auth.updater(), AWS.handleUpload(['leagueLogo', 'leagueHeader']), function(req, res, next) {
		Indicative.validateAll(req.body, Validators.league, Validators.messages)
			.then(function() {
				req.body.leagueSlug = slug(req.body.leagueName);
				League.create(req.body, function(err, league) {
					if (err) console.log(err);
					if (err) next(err);
					else res.json(league);
				});
			})
			.catch(function(errors) {
				console.log('catch triggered');
				var err = new Error("Bad Request");
				err.status = 400;
				err.errors = errors;
				next(err);
			});
	});
router.get('/game/:game_id', auth.public_api(), ratelimit, cache, function(req, res, next) {
	Game.findOne({
		gameAlias: req.params.game_id
	}, function(err, game) {
		if (err) next(err);
		if (!game) {
			err = new Error("League Not Found");
			err.status = 404;
			next(err);
		}
		League.find({
				leagueGame: game._id
			})
			.exec(function(err, leagues) {
				if (err) next(err);
				res.json(leagues);
			});
	})
});
router.route('/:league_id')
	.get(auth.public_api(), ratelimit, cache, function(req, res, next) {
		League.findById(req.params.league_id)
			.populate('leagueGame')
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
			Q.all([AWS.deleteImage(doc.leagueLogo), AWS.deleteImage(doc.leagueBanner)])
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
	.put(auth.updater(), AWS.handleUpload(['leagueLogo', 'leagueHeader']), function(req, res, next) {
		Indicative.validateAll(req.body, Validators.league, Validators.messages)
			.then(function() {
				req.body.leagueSlug = slug(req.body.leagueName);
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
