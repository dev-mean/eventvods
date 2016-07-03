var app = require('express');
var router = app.Router();
var logger = require('bristol');

//General routes
router.use('/validate', require('./api/validateRouter'));
router.use('/auth', require('./api/authRouter'));
router.use('/data', require('./api/staticRouter'));

//Model CRUD Routes
router.use('/overview', require('./api/overviewRouter'));
router.use('/games', require('./api/gamesRouter'));
router.use('/leagues', require('./api/leaguesRouter'));
router.use('/staff', require('./api/staffRouter'));
router.use('/teams', require('./api/teamsRouter'));
router.use('/maps', require('./api/mapsRouter'));
//Refactored
var auth = require('../controllers/auth');
var ratelimit = require('../controllers/ratelimit');
var AWS = require('../controllers/aws');
var cache = require('../controllers/cache');

//TODO

var Event = require('../models/event');
var Validators = require('../controllers/validation');
var Indicative = require('indicative');
var APIKey = require('../models/APIKey');

router.get('/test', ratelimit, function(req, res, next){
	res.send('Not ratelimited');
});

// This router is mounted at /api....so /events here translates to /api/events
// Enable CORS for /api routing.
// TODO: Consider whitelist / blacklisting domains?
router.all('*', function(req, res, next) {
	var oneof = false;
	if (req.headers.origin) {
		res.header('Access-Control-Allow-Origin', req.headers.origin);
		oneof = true;
	}
	if (req.headers['access-control-request-method']) {
		res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
		oneof = true;
	}
	if (req.headers['access-control-request-headers']) {
		res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
		oneof = true;
	}
	if (oneof) {
		res.header('Access-Control-Max-Age', 60 * 60 * 24 * 31);
	}
	// intercept OPTIONS method for pre-flight CORS check
	if (oneof && req.method == 'OPTIONS') {
		res.send(200);
	} else {
		next();
	}
});

//EVENTS
router.route('/events')
	.get(auth.public_api(), ratelimit, cache, function(req, res, next) {
		Event.find(function(err, events) {
			if (err) next(err);
			else res.json(events);
		});
	})
	.post(auth.updater(), function(req, res, next) {
		Indicative.validateAll(req.body, Validators.event, Validators.messages)
			.then(function() {
				Event.create(req.body, function(err, event) {
					if (err) next(err);
					else res.json(event);
				});
			})
			.catch(function(errors) {
				var err = new Error("Bad Request");
				err.status = 400;
				err.errors = errors;
				next(err);
			});
	});
router.route('/event/:event_id')
	.get(auth.public_api(), ratelimit, cache, function(req, res, next) {
		Event.findById(req.params.event_id, function(err, event) {
			if (err) next(err);
			if (!event) {
				err = new Error("Event Not Found");
				err.status = 404;
				next(err);
			}
			res.json(event);
		});
	})
	.delete(auth.updater(), function(req, res, next) {
		Event.remove({
			_id: req.params.event_id
		}, function(err) {
			if (err) next(err);
			else res.sendStatus(204);
		});
	})
	.put(auth.updater(), function(req, res, next) {
		Indicative.validateAll(req.body, Validators.event, Validators.messages)
			.then(function() {
				Event.findByIdAndUpdate(req.params.event_id, req.body, function(err, event) {
					if (err) next(err);
					if (!event) {
						err = new Error("Event not found");
						err.status = 404;
						next(err);
					} else res.json(event);
				});
			})
			.catch(function(errors) {
				var err = new Error("Bad Request");
				err.status = 400;
				err.errors = errors;
				next(err);
			});
	});
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
