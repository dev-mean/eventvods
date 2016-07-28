var router = require('express').Router();
var Featured = require('../../models/featuredContainer');

router.get('/', function(req, res, next){
	Featured.findOne()
	.populate({
		path: 'games',
		model: 'Game',
		select: 'gameName gameAlias'
	})
	.exec(function(err, featuredContent){
		if(err) next(err);
		res.json(featuredContent);
	});
});
router.get('/create', function(req, res, next){
	Featured.findOne(function(err, featuredContent){
		if(err) next(err);
		featuredContent.save();
	});
});


module.exports = router;
