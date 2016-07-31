var router = require('express').Router();
var Staff = require('../../models/staff');
var auth = require('../../controllers/auth');
var ratelimit = require('../../controllers/ratelimit');
var AWS = require('../../controllers/aws');
var cache = require('../../controllers/cache');
var Indicative = require('indicative');
var Validators = require('../../controllers/validation');

router.route('/')
	.get(auth.public_api(), ratelimit, cache, function(req, res, next) {
		Staff.find(function(err, staff) {
			if (err) next(err);
			res.json(staff);
		});
	})
	.post(auth.updater(), AWS.handleUpload(['photo']), function(req, res, next) {
		Indicative.validateAll(req.body, Validators.staff, Validators.messages)
			.then(function() {
				Staff.create(req.body, function(err, staff) {
					if (err) next(err);
					res.json(staff);
				});
			})
			.catch(function(errors) {
				var err = new Error("Bad Request");
				err.status = 400;
				err.errors = errors;
				next(err);
			});
	});
router.route('/:staff_id')
	.delete(auth.updater(), function(req, res, next) {
		Staff.findById(req.params.staff_id, function(err, doc) {
			AWS.deleteImage(doc.photo)
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
	.get(auth.public_api(), ratelimit, cache, function(req, res, next) {
		Staff.findById(req.params.staff_id, function(err, staff) {
			if (err) next(err);
			if (!staff) {
				err = new Error("Staff Not Found");
				err.status = 404;
				next(err);
			}
			res.json(staff);
		});
	})
	.put(auth.updater(), AWS.handleUpload(['photo']), function(req, res, next) {
		Indicative.validateAll(req.body, Validators.staff, Validators.messages)
			.then(function() {
				Staff.findByIdAndUpdate(req.params.staff_id, req.body, function(err, staff) {
					if (err) next(err);
					if (!staff) {
						err = new Error("Staff Not Found");
						err.status = 404;
						next(err);
					} else res.json(staff);
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
