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
		select: 'name slug game shortTitle subtitle startDate endDate updatedAt createdAt updated logo header header_blur textOrientation',
		populate: {
			path: 'game',
			model: 'Game',
			select: 'name icon'
		}
	})
	.populate({
		path: 'tournaments',
		model: 'Tournament',
		select: 'name subtitle shortTitle slug logo startDate endDate updatedAt createdAt updated header header_blur textOrientation'
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
