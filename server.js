//dev config
require('dotenv')
	.config({
		silent: false
	});
//keymetrics
var pmx = require('pmx').init({
	http: true,
	network: true,
	custom_probes: true,
	errors: true,
	alert_enabled: false
});
//server setup
var express = require('express');
var app = express();
//Trust remote proxy header from Nginx
app.set('trust proxy', true);
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local')
	.Strategy;
var morgan = require('morgan'); //Logger
var session = require('express-session');
var User = require('./app/models/user');
var config = require('./config/config');
var RedisStore = require('connect-redis')(session);
var favicon = require('serve-favicon');
var redis = require('./app/controllers/redis');
app.use(morgan('tiny'));
//Set up logging
var logger = require('bristol');
logger.addTarget('console')
	.withFormatter('human')
if(process.env.NODE_ENV !== "development")
	logger.addTarget('loggly', config.logs)
		.withFormatter('json')
		.withLowestSeverity('warn');
app.use(require('prerender-node').set('prerenderToken', config.prerender));
//Static file at the top, prevents all the code below being run for static files.
app.use('/assets', express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.urlencoded({
	"limit": "25mb",
	"extended": true,
	"parameterLimit": 1000,
	"type": 'application/x-www-form-urlencoding'
}));
app.use(bodyParser.json({
	"limit": "25mb",
	"parameterLimit": 1000,
	"type": 'application/json'
}));
app.use(session({
	secret: config.secret,
	resave: false,
	saveUninitialized: false,
	store: new RedisStore({
		client: redis,
		prefix: ':session:',
		ttl: 604800
	})
}));
/* Passport setup */
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect(config.databaseUrl, function(err) {
	if (err) logger.error(err);
	else logger.info("MongoDB server online.");
});
//routes
var backend = require('./app/routes/backend');
var frontend = require('./app/routes/frontend');
var api = require('./app/routes/api');
app.use('/api', api);
app.use('/manage', backend);
app.use('/', frontend);
// 404 handler
app.use(function(req, res, next) {
	var err = new Error("404 - Page Not Found");
	err.status = 404;
	err.path = req.path;
	next(err);
});
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	logger.error(err, {
		current_user: req.isAuthenticated() ? req.user : {"authenticated": false},
	});
	res.redirect('/error');
});
logger.info('NODE_ENV: ' + process.env.NODE_ENV);
//listens
app.listen(config.port);
logger.info('App listening on localhost:' + config.port);
