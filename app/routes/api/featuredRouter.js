var router = require('express').Router();
var Featured = require('../../models/featuredContainer');
var auth = require('../../controllers/auth');

router.get('/', function(req, res, next){
	Featured.findOne()
	.populate({
		path: 'games',
		model: 'Game',
		select: 'gameName gameAlias'
	})
	.populate({
		path: 'leagues',
		model: 'League',
		select: 'leagueName leagueSlug'
	})
	.exec(function(err, featuredContent){
		if(err) next(err);
		res.json(featuredContent);
	});
});
router.post('/', auth.updater(), function(req, res, next){
	Featured.findOneAndUpdate({}, req.body, {}, function(err){
		if(err) next(err);
		else res.sendStatus('204');
	});
});


module.exports = router;
