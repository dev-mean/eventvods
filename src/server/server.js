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


//server config
app.set('env', 'development');
process.env.NODE_ENV = 'development';
app.use(morgan('dev'));

//Static file at the top, prevents all the code below being run for static files.
app.use('/assets', express.static(path.join(__dirname, '..', 'public')));

var config = require('./config/config');

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
	saveUninitialized: true
}));

/* Passport setup */
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect(config.databaseUrl, function(err) {
	if(err)	console.log("DB err: " + err);
	else console.log("Connected to mongodb");
});

//templating
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.locals.pretty = true;

//routes
var routes = require('./routes/routes');
var api = require('./routes/api');
var auth = require('./routes/auth.js');
app.use('/', routes);
app.use('/api/', api);
app.use('/users/', auth);


var router = express.Router();
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		/* res.render('error', {
		  message: err.message,
		  error: err
		});*/
	});
}

//listens
var port = config.port;
var db = config.databaseUrl;
if(config.ip) {
      app.listen(port, config.ip);
} else {
      app.listen(port);
}

console.log('App listening on ' + (config.ip || 'localhost') + ':' + port);
console.log('Database: ' + db);