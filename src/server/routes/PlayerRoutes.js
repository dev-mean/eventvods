/**
 * Created by Nick on 7/20/2015.
 */
    var path = required('path');
    var fs = required('fs');

    var Player = require('../models/player');

    module.exports = function(app, passport) {
        app.get('/', function(req, res) {
            Event.find(function(err, events) {
                if (err)
                {
                    res.send(err);
                }
                res.json(events);
            });
        });

        app.post('', function(req, res) {

        })
    }