var router = require('express').Router();
var Game = require('../../models/game');
var auth = require('../../controllers/auth');
var ratelimit = require('../../controllers/ratelimit');
var AWS = require('../../controllers/aws');
var cache = require('../../controllers/cache');
var Indicative = require('indicative');
var Validators = require('../../controllers/validation');
var Q = require('q');
var slug = require('slug');
var League = require('../../models/league');

router.get('/slug/:slug', auth.public_api(), ratelimit, cache, function(req, res, next) {
		Game.findOne({
			slug: req.params.slug
		})
		.exec(function(err, game) {
			if (err) next(err);
			League.find({
				"game": game._id
			})
			.exec(function(err, leagues) {
				console.log(leagues);
				if (err) next(err);
				game.leagues = ["test"];
				res.json(game);
			});
		});
	})

router.route('/')
	.get(auth.public_api(), ratelimit, cache, function(req, res, next) {
		Game.find(function(err, games) {
			if (err) next(err);
			else res.json(games);
		});
	})
	.post(auth.updater(), AWS.handleUpload(['icon', 'header']), function(req, res, next) {
		Indicative.validateAll(req.body, Validators.game, Validators.messages)
			.then(function() {
				req.body.slug = slug(req.body.slug);
				Game.create(req.body, function(err, game) {
					if (err) console.log(err);
					if (err) next(err);
					else res.json(game);
				});
			})
			.catch(function(errors) {
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
			Q.all([AWS.deleteImage(doc.icon), AWS.deleteImage(doc.header),AWS.deleteImage(doc.header_blur)])
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
	.put(auth.updater(), AWS.handleUpload(['icon', 'header']), function(req, res, next) {
		Indicative.validateAll(req.body, Validators.game, Validators.messages)
			.then(function() {
				req.body.slug = slug(req.body.slug);
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
