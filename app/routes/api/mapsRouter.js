var router = require('express').Router();
var Map = require('../../models/map');
var auth = require('../../controllers/auth');
var ratelimit = require('../../controllers/ratelimit');
var AWS = require('../../controllers/aws');
var cache = require('../../controllers/cache');
var Indicative = require('indicative');
var Validators = require('../../controllers/validation');

router.route('/')
	.get(auth.public_api(), ratelimit, cache, function(req, res, next) {
		Map.find()
			.populate('mapGame')
			.exec(function(err, maps) {
				if (err) next(err);
				else res.json(maps);
			});
	})
	.post(auth.updater(), AWS.handleUpload(['mapImage']), function(req, res, next) {
		Indicative.validateAll(req.body, Validators.map, Validators.messages)
			.then(function() {
				Map.create(req.body, function(err, map) {
					if (err) next(err);
					res.json(map);
				});
			})
			.catch(function(errors) {
				var err = new Error("Bad Request");
				err.status = 400;
				err.errors = errors;
				next(err);
			});
	});
router.route('/:map_id')
	.delete(auth.updater(), function(req, res, next) {
		Map.findById(req.params.map_id, function(err, doc) {
			AWS.deleteImage(doc.mapImage)
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
		Map.findById(req.params.map_id)
			.populate('mapGame')
			.exec(function(err, map) {
				if (err) next(err);
				if (!map) {
					err = new Error("Map Not Found");
					err.status = 404;
					return next(err);
				}
				res.json(map);
			});
	})
	.put(auth.updater(), AWS.handleUpload(['mapImage']), function(req, res, next) {
		Indicative.validateAll(req.body, Validators.map, Validators.messages)
			.then(function() {
				Map.findByIdAndUpdate(req.params.map_id, req.body, function(err, map) {
					if (err) next(err);
					if (!map) {
						err = new Error("Map Not Found");
						err.status = 404;
						next(err);
					} else res.json(map);
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
