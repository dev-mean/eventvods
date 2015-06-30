//server setup
    var express = require('express');
    var app = express();
    var fs = require('fs');
    var path = require('path');
    var mongoose = require('mongoose');
    var bodyParser = require('body-parser');
    
//server config
    var config = require('./config/config');
    mongoose.connect(config.databaseUrl);
    app.use(bodyParser.urlencoded({'extended':'true'}));
    app.use(bodyParser.json());
    app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
    
    //templating
    app.set('view engine', 'ejs');
    
//routes
    require('./routes/routes')(app);
    app.use('/css', express.static(path.join(__dirname, '..', 'public/css')));
    app.use('/js', express.static(path.join(__dirname, '..', 'public/js')));
    app.use('/img', express.static(path.join(__dirname, '..', 'public/img')));
    app.use('/fonts', express.static(path.join(__dirname, '..', 'public/fonts')));
    
//listens
    var port = config.port;
    app.listen(port);
    console.log('App listening on ' + port);
    console.log('mongodb://' + config.ip + ':' + port);