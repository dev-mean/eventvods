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
app.use(morgan('tiny'));
//Set up logging
var logger = require('bristol');
if (process.env.NODE_ENV == "development") {
    logger.addTarget('console')
        .withFormatter('human')
} else {
    logger.addTarget('loggly', config.logs)
        .withFormatter('json')
        .withLowestSeverity('warn');
}
//Static file at the top, prevents all the code below being run for static files.
app.use('/assets', express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.urlencoded({
    'extended': 'true'
}));
app.use(bodyParser.json({
    "limit": "100mb",
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
mongoose.connect(config.databaseUrl, function(err) {
    if (err) logger.error(err);
    else logger.info("MongoDB server online.");
});
//templating
app.set('views', path.join(__dirname, 'app', 'views'));
app.set('view engine', 'jade');
app.locals.pretty = true;
//routes
var backend = require('./app/routes/backend');
var frontend = require('./app/routes/frontend');
var api = require('./app/routes/api');
var auth = require('./app/routes/auth.js');
app.use('/user', auth);
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
    logger.error(err);
    if (process.env.NODE_ENV == "development") res.render('error', {
        message: err.message,
        stack: err.stack
    });
    else res.render('error', {
        message: err.message
    });
});
logger.info('NODE_ENV: ' + process.env.NODE_ENV);
//listens
app.listen(config.port);
logger.info('App listening on localhost:' + config.port);