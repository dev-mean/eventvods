var router = require('express').Router();
var League = require('../../models/league');
var auth = require('../../controllers/auth');
var ratelimit = require('../../controllers/ratelimit');
var AWS = require('../../controllers/aws');
var cache = require('../../controllers/cache');
var Indicative = require('indicative');
var Validators = require('../../controllers/validation');
var Q = require('q');
var slug = require('slug');
var exporter = require('../../controllers/export');

router.route('/')
    .get(auth.public_api(), ratelimit, cache, function(req, res, next) {
        League.find()
            .select('_id game name subtitle slug')
            .populate('game', 'slug icon -_id')
            .populate({
				path: 'teams',
				model: 'Teams',
                select: 'name tag _id slug icon'
			})
            .exec(function(err, leagues) {
                if (err) next(err);
                else res.json(leagues);
            });
    })
    .post(auth.updater(), AWS.handleUpload(['logo', 'header']), function(req, res, next) {
        req.body.startDate = Date.parse(req.body.startDate);
        req.body.endDate = Date.parse(req.body.endDate);
        Indicative.validateAll(req.body, Validators.league, Validators.messages)
            .then(function() {
                req.body.slug = slug(req.body.slug);
                League.create(req.body, function(err, league) {
                    if (err) next(err);
                    else res.json(league);
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
            err = new Error("League Not Found");
            err.status = 404;
            next(err);
        }
        League.find({
                game: game._id
            })
            .populate('game staff')
            .populate({
                path: 'teams',
                model: 'Teams',
                select: 'name tag _id slug icon'
            })
            .exec(function(err, leagues) {
                if (err) next(err);
                res.json(leagues);
            });
    });
});
router.get('/slug/:slug', auth.public_api(), ratelimit, cache, function(req, res, next) {
    League.findOne({
            slug: req.params.slug
        })
        .select('-__v -textOrientation')
        .populate('game staff')
        .populate({
            path: 'teams',
            model: 'Teams',
                select: 'name tag _id slug icon'
        })
        .exec(function(err, leagues) {
            if (err) next(err);
            else res.json(leagues);
        });
})
router.get('/export/:league_id', auth.updater(), function(req, res, next) {
    League.findById(req.params.league_id)
        .populate('game staff')
        .populate({
            path: 'teams',
            model: 'Teams',
                select: 'name tag _id slug icon'
        })
        .exec(function(err, league) {
            if (err) next(err);
            if (!league) {
                err = new Error("League Not Found");
                err.status = 404;
                next(err);
            }
            res.send(exporter.parse(league));
        });
})
router.route('/:league_id')
    .get(auth.public_api(), ratelimit, cache, function(req, res, next) {
        League.findById(req.params.league_id)
            .populate('game staff')
            .populate({
                path: 'teams',
                model: 'Teams',
                select: 'name tag _id slug icon'
            })
            .populate({
                path: 'contents.modules.matches.team1 contents.modules.matches.team2',
                model: 'Teams',
                select: 'name tag _id slug icon'
            })
            .exec(function(err, league) {
                if (err) next(err);
                if (!league) {
                    err = new Error("League Not Found");
                    err.status = 404;
                    next(err);
                }
                res.json(league);
            });
    })
    .delete(auth.updater(), function(req, res, next) {
        League.findById(req.params.league_id, function(err, doc) {
            Q.all([AWS.deleteImage(doc.logo), AWS.deleteImage(doc.header), AWS.deleteImage(doc.header_blur)])
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
        Indicative.validateAll(req.body, Validators.league, Validators.messages)
            .then(function() {
                req.body.slug = slug(req.body.slug);
                League.findByIdAndUpdate(req.params.league_id, req.body)
                    .exec(function(err, league) {
                        if (err) next(err);
                        if (!league) {
                            err = new Error("League not found");
                            err.status = 404;
                            next(err);
                        } else res.json(league);
                    });
            })
            .catch(function(errors) {
                var err = new Error("Bad Request");
                err.status = 400;
                err.errors = errors;
                next(err);
            });
    });

module.exports = router;