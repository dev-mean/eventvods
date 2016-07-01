var router = require('express').Router();
var Game = require('../models/game');

router.get('/gameAlias/:alias', function(req, res, next) {
    Game.find({
            gameAlias: req.params.alias
        })
        .count()
        .exec(function(err, count) {
            if (err) next(err);
            if (count > 0) return res.sendStatus('409');
            else return res.sendStatus('200');
        });
});
router.get('/gameAlias/:alias/:id', function(req, res, next) {
    Game.findOne({
        gameAlias: req.params.alias
    }, function(err, doc) {
        if (err) next(err);
        if (!doc) return res.sendStatus('200');
        else if (doc._id == req.params.id) return res.sendStatus('200');
        else return res.sendStatus('409');
    });
});


module.exports = router;