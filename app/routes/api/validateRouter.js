var router = require('express').Router();
var Game = require('../../models/game');
var User = require('../../models/user');
var Event = require('../../models/event');
var Staff = require('../../models/staff');
var Team = require('../../models/team');
var Article = require('../../models/article');

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

router.get('/eventSlug/:slug', function(req, res, next) {
    Event.find({
            slug: req.params.slug
        })
        .count()
        .exec(function(err, count) {
            if (err) next(err);
            if (count > 0) return res.sendStatus('409');
            else return res.sendStatus('200');
        });
});
router.get('/eventSlug/:slug/:id', function(req, res, next) {
    Event.findOne({
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
router.get('/teamSlug/:slug/game/:game', function(req, res, next) {
    Team.find({
            slug: req.params.slug,
			game: req.params.game
        })
        .count()
        .exec(function(err, count) {
            if (err) next(err);
            if (count > 0) return res.sendStatus('409');
            else return res.sendStatus('200');
        });
});
router.get('/teamSlug/:slug/:id/game/:game', function(req, res, next) {
    Team.findOne({
        slug: req.params.slug,
		game: req.params.game
    }, function(err, doc) {
        if (err) next(err);
        if (!doc) return res.sendStatus('200');
        else if (doc._id == req.params.id) return res.sendStatus('200');
        else return res.sendStatus('409');
    });
});
router.get('/articleSlug/:slug', function(req, res, next) {
    Article.find({
            slug: req.params.slug
        })
        .count()
        .exec(function(err, count) {
            if (err) next(err);
            if (count > 0) return res.sendStatus('409');
            else return res.sendStatus('200');
        });
});
router.get('/articleSlug/:slug/:id', function(req, res, next) {
    Article.findOne({
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

router.get('/displayName/:name/:id', function(req, res, next) {
    User.findOne({
        displayName: req.params.name.toUpperCase()
    }, function(err, doc) {
        if (err) next(err);
        if (!doc) return res.sendStatus('200');
        else if (doc._id == req.params.id) return res.sendStatus('200');
        else return res.sendStatus('409');
    });
});

router.get('/email/:email', function(req, res, next){
	if(req.params.email == req.user.email) res.sendStatus('204');
	User.count({
		email: req.params.email
	}, function(err, count){
		if(err) next(err);
		if(count > 0) res.sendStatus('409');
		else res.sendStatus('204');
	});
});

router.get('/email/:email/:id', function(req, res, next) {
    User.findOne({
        email: req.params.email
    }, function(err, doc) {
        if (err) next(err);
        if (!doc) return res.sendStatus('200');
        else if (doc._id == req.params.id) return res.sendStatus('200');
        else return res.sendStatus('409');
    });
});

module.exports = router;
