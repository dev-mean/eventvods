var router = require('express').Router();
var Game = require('../../models/game');
var League = require('../../models/league');
var async = require('async');

router.get('/', function(req, res, next){
	async.parallel({
		games: function(cb){
			Game
				.find({})
				.select('gameAlias gameName gameIcon gameBanner -_id')
				.exec(function(err, docs){
					if(err) cb(err, null);
					else cb(null, docs);
				});
		},
		leagues: function(cb){
			League
				.find({})
				.select('leagueName leagueSlug leagueGame -_id')
				.populate('leagueGame','gameIcon -_id')
				.exec(function(err, docs){
					if(err) cb(err, null);
					else cb(null, docs);
				});
		}
	}, function(err, obj){
		if(err) next(err);
		else res.json(obj);
	});
});

module.exports = router;
