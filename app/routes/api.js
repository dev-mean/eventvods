var app = require('express');
var router = app.Router();
var logger = require('bristol');
var async = require('async');

//General routes
router.use('/validate', require('./api/validateRouter'));
router.use('/auth', require('./api/authRouter'));
router.use('/data', require('./api/staticRouter'));

//Model CRUD Routes
router.use('/overview', require('./api/overviewRouter'));
router.use('/featured', require('./api/featuredRouter'));
router.use('/games', require('./api/gamesRouter'));
router.use('/leagues', require('./api/leaguesRouter'));
router.use('/staff', require('./api/staffRouter'));
router.use('/teams', require('./api/teamsRouter'));
router.use('/users', require('./api/usersRouter'));

//Refactored
var auth = require('../controllers/auth');
var ratelimit = require('../controllers/ratelimit');
var AWS = require('../controllers/aws');
var cache = require('../controllers/cache');

//TODO
var Validators = require('../controllers/validation');
var Indicative = require('indicative');
var APIKey = require('../models/APIKey');

//APIKEYS
router.route('/keys')
	.get(auth.admin(), function(req, res, next) {
		APIKey.find(function(err, keys) {
			if (err) next(err);
			res.json(keys);
		});
	})
	.post(auth.admin(), function(req, res, next) {
		Indicative.validateAll(req.body, Validators.api, Validators.messages)
			.then(function() {
				auth.generate_key(req, res, function(err, key) {
					if (err) next(err);
					res.json(key);
				});
			})
			.catch(function(errors) {
				var err = new Error("Bad Request");
				err.status = 400;
				err.errors = errors;
				next(err);
			});
	});
router.route('/key/:keyid')
	.delete(auth.admin(), function(req, res, next) {
		APIKey.remove({
			_id: req.params.keyid
		}, function(err) {
			if (err) next(err);
			else res.sendStatus(204);
		});
	})
	.put(auth.admin(), function(req, res, next) {
		Indicative.validateAll(req.body, Validators.api, Validators.messages)
			.then(function() {
				APIKey.findByIdAndUpdate(req.params.keyid, req.body, function(err, key) {
					if (err) next(err);
					if (!key) {
						err = new Error("APIKey Not Found");
						err.status = 404;
						next(err);
					} else res.json(key);
				});
			})
			.catch(function(errors) {
				var err = new Error("Bad Request");
				err.status = 400;
				err.errors = errors;
				next(err);
			});
	});

// 404 handler
router.use(function(req, res, next) {
	var err = new Error("Invalid API route");
	err.status = 404;
	next(err);
});
// prints stacktrace only in dev mode
router.use(function(err, req, res, next) {
	res.status(err.status || 500);
	if (err.status == 403 || err.status == 401 || err.status == 404 || err.status == 429) logger.warn(err);
	else logger.error(err);
	if (process.env.NODE_ENV == "development" || app.get('env') == "development") res.json({
		"status": err.status,
		"message": err.message,
		"errors": err.errors,
		"stack": err.stack
	});
	else res.json({
		"status": err.status,
		"errors": err.errors,
		"message": err.message
	});
});
module.exports = router;
