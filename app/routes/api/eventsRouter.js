var router = require('express').Router();
var Event = require('../../models/event');
var auth = require('../../controllers/auth');
var ratelimit = require('../../controllers/ratelimit');
var AWS = require('../../controllers/aws');
var cache = require('../../controllers/cache');
var Indicative = require('indicative');
var Validators = require('../../controllers/validation');
var Q = require('q');
var slug = require('slug');
var exporter = require('../../controllers/export');
var Match = require('../../models/match');
var Game = require('../../models/game');

//Individual base promise for updating a match
function updateMatch(match){
    var $promise = Q.defer();
    if(typeof match._id !== "undefined")
        Match.findByIdAndUpdate(match._id, match)
            .exec((err, match) => {
                if(err) $promise.reject(err);
                else $promise.resolve(match._id);
            });
    else Match.create(match)
        .then((match) => {
            $promise.resolve(match._id);
        })
        .catch((err) => {
            promise.reject(err);
        })
    return $promise.promise;
}
//This is painful but required
function updateAllMatches(body){
    // Due to data layout (not simple arrays), we have to actually assign the promise value in between layers.
    // There must be a better way of doing this... (but it works for now)
    var $promise = Q.defer();
    Q.all(body.contents.map((section) =>{
        var _p = Q.defer();
       Q.all(section.modules.map((module) => {
            var __p = Q.defer();
            // A module is resolved after all matches for the module are updated
            Q.all(module.matches2.map((match) => {
                return updateMatch(match);
            }))
            .then((matches) => {
                module.matches2 = matches;
                __p.resolve(module);
            })
            .catch((err) => {
                __p.reject(err);
            });
            return __p.promise;
        }))
        .then((modules) => {
            section.modules = modules;
            _p.resolve(section);
        })
        .catch((err) => {
            _p.reject(err);
        });
        return _p.promise;
    }))
    .then((sections) => {
        body.contents = sections;
        $promise.resolve(body);
    })
    .catch((err) => {
        $promise.reject(err);
    });
    return $promise.promise;
}
router.route('/')
    .get(auth.public_api(), ratelimit, cache, function(req, res, next) {
        Event.find()
            .select('_id game name slug startDate endDate teams staff logo')
            .fill('followers')
            .populate('game', 'slug icon -_id name')
            .exec(function(err, events) {
                if (err) next(err);
                else res.json(events);
            });
    })
    .post(auth.updater(), AWS.handleUpload(['logo', 'header']), function(req, res, next) {
        req.body.startDate = Date.parse(req.body.startDate);
        req.body.endDate = Date.parse(req.body.endDate);
        Indicative.validateAll(req.body, Validators.event, Validators.messages)
            .then(function() {
                req.body.slug = slug(req.body.slug);
                Event.create(req.body, function(err, event) {
                    if (err) next(err);
                    else res.json(event);
                });
            })
            .catch(function(errors) {
                var err = new Error("Bad Request");
                err.status = 400;
                err.errors = errors;
                next(err);
            });
    });
router.get('/game/:slug', auth.public_api(), ratelimit, cache, function(req, res, next) {
    Game.findOne({
        slug: req.params.slug
    }, function(err, game) {
        if (err) next(err);
        if (!game) {
            err = new Error("Game Not Found");
            err.status = 404;
            next(err);
        }
        Event.find({
                game: game._id
            })
            .select('_id name game subtitle slug startDate endDate logo')
            .populate('game')
            .exec(function(err, events) {
                if (err) next(err);
                res.json(events);
            });
    });
});
router.get('/slug/:slug', auth.public_api(), ratelimit, cache, function(req, res, next) {
    Event.findOne({
            slug: req.params.slug
        })
        .select('-__v -textOrientation')
        .populate('game staff contents.modules.matches2')
        .populate({
                path: 'contents.modules.matches2',
                model: 'Match',
                populate: {
                    path: 'team1 team2',
                    model: 'Teams',
                    select: 'name tag _id slug icon'
                }
            })
        .populate({
            path: 'teams',
            model: 'Teams',
                select: 'name tag _id slug icon'
        })
        .exec(function(err, event) {
            if (err) next(err);
            else res.json(event);
        });
})
router.get('/export/:event_id', auth.updater(), function(req, res, next) {
    Event.findById(req.params.event_id)
        .select('-__v -textOrientation')
        .populate('game staff contents.modules.matches2')
        .populate({
                path: 'contents.modules.matches2',
                model: 'Match',
                populate: {
                    path: 'team1 team2',
                    model: 'Teams',
                    select: 'name tag _id slug icon'
                }
            })
        .populate({
            path: 'teams',
            model: 'Teams',
            select: 'name tag _id slug icon media'
        })
        .exec(function(err, event) {
            if (err) next(err);
            if (!event) {
                err = new Error("E Not Found");
                err.status = 404;
                next(err);
            }
            res.send(exporter.parse(event));
        });
})
router.route('/:event_id')
    .get(auth.public_api(), ratelimit, cache, function(req, res, next) {
        Event.findById(req.params.event_id)
            .populate('game staff')
            .populate({
                path: 'teams',
                model: 'Teams',
                select: 'name tag _id slug icon'
            })
            .populate({
                path: 'contents.modules.matches2',
                model: 'Match',
                populate: {
                    path: 'team1 team2',
                    model: 'Teams',
                    select: 'name tag _id slug icon'
                }
            })
            .exec(function(err, event) {
                if (err) next(err);
                if (!event) {
                    err = new Error("E Not Found");
                    err.status = 404;
                    next(err);
                }
                res.json(event);
            });
    })
    .delete(auth.updater(), function(req, res, next) {
        Event.findById(req.params.event_id, function(err, doc) {
            if(doc) Q.all([AWS.deleteImage(doc.logo), AWS.deleteImage(doc.header), AWS.deleteImage(doc.header_blur)])
                .then(function() {
                    doc.remove(function(err) {
                        if (err) next(err);
                        else res.sendStatus(204);
                    });
                }, function(err) {
                    next(err);
                });
        });
    })
    .put(auth.updater(), AWS.handleUpload(['logo', 'header']), function(req, res, next) {
        req.body.startDate = Date.parse(req.body.startDate);
        req.body.endDate = Date.parse(req.body.endDate);
        Indicative.validateAll(req.body, Validators.event, Validators.messages)
            .then(function() {
                req.body.slug = slug(req.body.slug);
                updateAllMatches(req.body)
                .then(function(contents){
                    Event.findByIdAndUpdate(req.params.event_id, req.body)
                        .exec(function(err, event) {
                            if (err) next(err);
                            if (!event) {
                                err = new Error("E not found");
                                err.status = 404;
                                next(err);
                            } else res.json(event);
                        });
                })
                .catch(function(err){
                    next(err);
                })
            })
            .catch(function(errors) {
                var err = new Error("Bad Request");
                err.status = 400;
                err.errors = errors;
                next(err);
            });
    });
router.delete('/match/:id', auth.updater(), function(req, res, next) {
        Match.findById(req.params.id, function(err, doc) {
            if(err) next(err);
            else doc.remove(function(err){
                if(err) next(err);
                else res.sendStatus(204);
            });
        });
    })
router.get('/admin/cleanup', auth.admin(), function(req, res, next){
    Match.find()
    .fill('event')
    .exec((err, matches) => {
        if(err) next(err);
        else {
            matches.forEach((match) => {
                if(match.event == null) match.remove();
            })
        }
    })
})

module.exports = router;