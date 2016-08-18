var router = require('express').Router();
var Featured = require('../../models/featuredContainer');
var auth = require('../../controllers/auth');

router.get('/', function(req, res, next){
	Featured.findOne()
	.populate({
		path: 'games',
		model: 'Game',
		select: 'name slug icon'
	})
	.populate({
		path: 'leagues',
		model: 'League',
		select: 'name slug game subtitle',
		populate: {
			path: 'game',
			model: 'Game',
			select: 'name icon'
		}
	})
	.populate({
		path: 'tournaments',
		model: 'Tournament',
		select: 'name slug logo'
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
