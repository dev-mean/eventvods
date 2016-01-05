//server setup
var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var morgan = require('morgan'); //Logger
var session = require('express-session');
var User = require('./models/user');
var config = require('./config/config');
var RedisStore = require('connect-redis')(session);

//server config
app.set('env', 'development');
process.env.NODE_ENV = 'development';
app.use(morgan('dev'));

//Set up logging
var logger = require('bristol');
//logger.addTarget('loggly', config.logs)
//.withFormatter('json')
//.withLowestSeverity('warn');
logger.addTarget('console')
	.withFormatter('human');
//.withHighestSeverity('trace');


//Static file at the top, prevents all the code below being run for static files.
app.use('/assets', express.static(path.join(__dirname, '..', 'public')));


app.use(bodyParser.urlencoded({
	'extended': 'true'
}));

app.use(bodyParser.json());

app.use(bodyParser.json({
	type: 'application/vnd.api+json'
}));

app.use(session({
	secret: config.secret,
	resave: false,
	saveUninitialized: true,
	store: new RedisStore({
		host: config.redis.host,
		port: config.redis.port,
		pass: config.redis.auth,
		ttl: 604800
	})
}));

/* Passport setup */
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect(config.databaseUrl, function (err) {
	if (err) logger.error(err);
	else logger.info("MongoDB server online.");
});

//templating
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.locals.pretty = true;

//routes
var routes = require('./routes/routes');
var api = require('./routes/api');
var auth = require('./routes/auth.js');
app.use('/user', auth);
app.use('/api', api);
app.use('/', routes);

// 404 handler
app.use(function (req, res, next) {
	var err = new Error("404 - Page Not Found");
	err.status = 404;
	next(err);
});

// prints stacktrace only in dev mode
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	logger.error(err);

	if (process.env.NODE_ENV == "development" || app.get('env') == "development")
		res.render('error', {
			message: err.message,
			stack: err.stack
		});
	else res.render('error', {
		message: err.message
	});

});

//listens
var port = config.port;
var db = config.databaseUrl;
if (config.ip) {
	app.listen(port, config.ip);
} else {
	app.listen(port);
}

logger.info('App listening on ' + (config.ip || 'localhost') + ':' + port);
