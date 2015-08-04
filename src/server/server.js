//server setup
var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var passport_strategy = require('passport-local').Strategy;
var morgan = require('morgan'); //Logger
var session = require('express-session');

//server config
app.set('env', 'development');
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
	secret: 'eventvods_dev',
	resave: false,
	saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect(config.databaseUrl, function(err) {
	if(err)	console.log("DB err: "+ err);
	else console.log("Connected to mongodb");
});

//templating
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.locals.pretty = true;

//routes
var routes = require('./routes/routes');
var api = require('./routes/api');
app.use('/', routes);
app.use('/api/', api);



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
app.listen(port);
console.log('App listening on localhost:' + port);
console.log('Database: ' + db);