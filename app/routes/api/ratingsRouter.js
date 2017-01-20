var router = require('express').Router();
var auth = require('../../controllers/auth');
var ratelimit = require('../../controllers/ratelimit');
var Indicative = require('indicative');
var Validators = require('../../controllers/validation');
var Rating = require('../../models/rating');
var Match = require('../../models/match');
var Q = require('q');

function recalcRatings(rating){
	var $promise = Q.defer();
	Rating.aggregate({
        $match: {
            match: rating.match,
			index: rating.index
        }
    })
    .group({
        _id: null,
        average: {
            $avg: '$rating'
        }
    })
    .exec((err, res) => {
		if(err) $promise.reject(err);
		else
			Match.findById(rating.match)
			.exec((err, match) => {
				console.log(match.data[rating.index]);
				match.data[rating.index].rating = res[0].average;
				match.save((err) => {
					if(err) $promise.reject(err);
					else $promise.resolve();
				})
			})
	});
	return $promise.promise;
}

router.post('/', auth.logged_in(true), (req, res, next) => {
		Indicative.validateAll(req.body, Validators.rating, Validators.messages)
			.then(function() {
				Rating.findOne({
					match: req.body.match,
					user: req.user._id,
					index: req.body.index
				})
				.exec((err, rating) => {
					if(err) return next(err);
					if(rating){
						rating.rating = req.body.rating;
						rating.save()
						.then(recalcRatings)
						.then(() => {
							res.sendStatus('204');
						})
						.catch((err) => {
							next(err);
						});
					}
					else {
						Rating.create({
							match: req.body.match,
							user: req.user._id,
							rating: req.body.rating,
							index: req.body.index
						})
						.then(recalcRatings)
						.then(() => {
							res.sendStatus('204');
						})
						.catch((err) => {
							next(err);
						});
					}
				})
			})
			.catch(function(errors) {
				var err = new Error("Bad Request");
				err.status = 400;
				err.errors = errors;
				next(err);
			});
	});
module.exports = router;
