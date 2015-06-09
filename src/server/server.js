//server setup
    var express = require('express');
    var app = express();
    var fs = require('fs');
    var path = require('path');
    
//server config
    var config = require('./config/config');
    
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