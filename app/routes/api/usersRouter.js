var router = require('express').Router();
var User = require('../../models/user');
var auth = require('../../controllers/auth');
var Indicative = require('indicative');
var Validators = require('../../controllers/validation');
var AWS = require('../../controllers/aws');

router.route('/')
	.get(auth.admin(), function(req, res, next) {
		var time = new Date();
		User.find(function(err, users) {
			if (err) next(err);
			else res.json(users);
		});
	});

router.route('/:user_id')
	.get(auth.admin(), function(req, res, next) {
		User.findById(req.params.user_id, function(err, user) {
			if (err) next(err);
			if (!user) {
				err = new Error("User Not Found");
				err.status = 404;
				next(err);
			}
			res.json(user);
		});
	})
	.delete(auth.admin(), function(req, res, next) {
		User.findById(req.params.user_id, function(err, doc) {
			AWS.deleteImage(doc.profilePicture)
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
	.put(auth.admin(), AWS.handleUpload(['profilePicture']), function(req, res, next) {
		Indicative.validateAll(req.body, Validators.user, Validators.messages)
			.then(function() {
				User.findByIdAndUpdate(req.params.user_id, req.body, function(err, user) {
					if (err) next(err);
					if (!user) {
						err = new Error("User not found");
						err.status = 404;
						next(err);
					} else res.json(user);
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
