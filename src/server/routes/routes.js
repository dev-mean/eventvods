//requires
    var path = require('path');
    var fs = require('fs');
    
    var Event = require('../models/event');

//routez
    module.exports = function(app, passport) {
        
        //home page
        app.get('/', function(req, res) {
            res.render(path.join(__dirname, '..', '..', 'public/index.ejs'));
        });
        
        //event api
        app.get('/api/events', function(req, res) {
            /*Event.find(function(err, events) {
                if(err)
                    res.send(err);
                res.json(events);
            });*/
            res.json({event : "test data", event2 : "test data"});
        });
        
    };