/**
 * Created by Nick on 7/20/2015.
 */
    var path = require('path');
    var fs = require('fs');

    var Event = require('../models/event');

    module.exports = function(app, passport) {
        app.get('/', function(req, res) {
           res.render(path.join(_dirname, '..', '..', 'public/index.ejs'));
        });

        app.get('/api/events/retrieve', function(req, res){
            Event.find(function(err, events) {
                if (err)
                {
                    res.send(err);
                }
                res.json(events);
            });
        });

        app.post('/api/events/create', function(req, res) {
           Event.create({
               format : req.body.format,
               beginDate: new Date(),
               endDate: new Date(),
               tournamentLocation: req.body.tournamentLocation,
               casters: req.body.casters,
               panel: req.body.panel
           }, function(err, events) {
               if (err)
               {
                   res.send(err);
               }

               Event.find(function(err, events) {
                   if (err)
                   {
                       res.send(err)
                   }
                   res.json(events);
               });
           });
        });

        app.post('/api/events/:event_id/remove', function(req, res) {
          Event.remove({
              _id : req.params.event_id
          }, function(err, event)
              {
                  if(err)
                  {
                      res.send(err);
                  }
                  Todo.find(function(err, events) {
                      if (err)
                      {
                          res.send(err);
                      }
                      res.json(events);
                  });
              });
        });
    };
