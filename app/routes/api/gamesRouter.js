var router = require('express').Router();
var Game = require('../../models/game');
var auth = require('../../controllers/auth');
var ratelimit = require('../../controllers/ratelimit');
var AWS = require('../../controllers/aws');
var cache = require('../../controllers/cache');
var Indicative = require('indicative');
var Validators = require('../../controllers/validation');
var Q = require('q');

router.route('/')
	.get(auth.public_api(), ratelimit, cache, function(req, res, next) {
		var time = new Date();
		Game.find(function(err, games) {
			if (err) next(err);
			else res.json(games);
		});
	})
	.post(auth.updater(), AWS.handleUpload(['gameIcon', 'gameBanner']), function(req, res, next) {
		Indicative.validateAll(req.body, Validators.game, Validators.messages)
			.then(function() {
				Game.create(req.body, function(err, game) {
					if (err) console.log(err);
					if (err) next(err);
					else res.json(game);
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
router.route('/:game_id')
	.get(auth.public_api(), ratelimit, cache, function(req, res, next) {
		Game.findById(req.params.game_id, function(err, game) {
			if (err) next(err);
			if (!game) {
				err = new Error("Game Not Found");
				err.status = 404;
				next(err);
			}
			res.json(game);
		});
	})
	.delete(auth.updater(), function(req, res, next) {
		Game.findById(req.params.game_id, function(err, doc) {
			Q.all([AWS.deleteImage(doc.gameIcon), AWS.deleteImage(doc.gameBanner)])
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
	.put(auth.updater(), AWS.handleUpload(['gameIcon', 'gameBanner']), function(req, res, next) {
		Indicative.validateAll(req.body, Validators.game, Validators.messages)
			.then(function() {
				Game.findByIdAndUpdate(req.params.game_id, req.body, function(err, game) {
					if (err) next(err);
					if (!game) {
						err = new Error("Game not found");
						err.status = 404;
						next(err);
					} else res.json(game);
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
