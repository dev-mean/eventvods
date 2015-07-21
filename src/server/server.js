//server setup
    var express = require('express');
    var app = express();
    var fs = require('fs');
    var path = require('path');
    var mongoose = require('mongoose');
    var bodyParser = require('body-parser');
    
//server config
	app.set('env', 'development');
    var config = require('./config/config');
    app.use(bodyParser.urlencoded({'extended':'true'}));
    app.use(bodyParser.json());
    app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
	mongoose.connect(config.databaseUrl, function(err){
		console.log("Connected to mongodb");
	});
    
    //templating
    app.set('view engine', 'jade');
    
//routes
    require('./routes/routes')(app);
    app.use('/css', express.static(path.join(__dirname, '..', 'public/css')));
    app.use('/js', express.static(path.join(__dirname, '..', 'public/js')));
    app.use('/img', express.static(path.join(__dirname, '..', 'public/img')));
    app.use('/fonts', express.static(path.join(__dirname, '..', 'public/fonts')));
    

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
	var ip = config.ip;
    app.listen(port);
    console.log('App listening on ' + ip + ":" + port);
    console.log('Database: ' +db);