var router = require('express').Router();
var Game = require('../../models/game');
var User = require('../../models/user');
var League = require('../../models/league');
var Staff = require('../../models/staff');
router.get('/gameSlug/:slug', function(req, res, next) {
    Game.find({
            slug: req.params.slug
        })
        .count()
        .exec(function(err, count) {
            if (err) next(err);
            if (count > 0) return res.sendStatus('409');
            else return res.sendStatus('200');
        });
});
router.get('/gameSlug/:slug/:id', function(req, res, next) {
    Game.findOne({
        slug: req.params.slug
    }, function(err, doc) {
        if (err) next(err);
        if (!doc) return res.sendStatus('200');
        else if (doc._id == req.params.id) return res.sendStatus('200');
        else return res.sendStatus('409');
    });
});

router.get('/leagueSlug/:slug', function(req, res, next) {
    League.find({
            slug: req.params.slug
        })
        .count()
        .exec(function(err, count) {
            if (err) next(err);
            if (count > 0) return res.sendStatus('409');
            else return res.sendStatus('200');
        });
});
router.get('/leagueSlug/:slug/:id', function(req, res, next) {
    League.findOne({
        slug: req.params.slug
    }, function(err, doc) {
        if (err) next(err);
        if (!doc) return res.sendStatus('200');
        else if (doc._id == req.params.id) return res.sendStatus('200');
        else return res.sendStatus('409');
    });
});

router.get('/staffSlug/:slug', function(req, res, next) {
    Staff.find({
            slug: req.params.slug
        })
        .count()
        .exec(function(err, count) {
            if (err) next(err);
            if (count > 0) return res.sendStatus('409');
            else return res.sendStatus('200');
        });
});
router.get('/staffSlug/:slug/:id', function(req, res, next) {
    Staff.findOne({
        slug: req.params.slug
    }, function(err, doc) {
        if (err) next(err);
        if (!doc) return res.sendStatus('200');
        else if (doc._id == req.params.id) return res.sendStatus('200');
        else return res.sendStatus('409');
    });
});


router.get('/displayName/:name', function(req, res, next){
	if(req.params.name == req.user.displayName) res.sendStatus('204');
	User.count({
		displayName: req.params.name.toUpperCase()
	}, function(err, count){
		if(err) next(err);
		if(count > 0) res.sendStatus('409');
		else res.sendStatus('204');
	});
});

module.exports = router;
