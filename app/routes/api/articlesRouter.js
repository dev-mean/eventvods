var router = require('express').Router();
var Article = require('../../models/article');
var auth = require('../../controllers/auth');
var ratelimit = require('../../controllers/ratelimit');
var AWS = require('../../controllers/aws');
var cache = require('../../controllers/cache');
var Indicative = require('indicative');
var Validators = require('../../controllers/validation');
var Q = require('q');
var slug = require('slug');

router.route('/')
	.get(auth.public_api(), ratelimit, cache, function(req, res, next) {
		var time = new Date();
		Article.find()
		.populate('author','displayName')
		.exec(function(err, articles) {
			if (err) next(err);
			else res.json(articles);
		});
	})
	.post(auth.writer(), AWS.handleUpload(['header']), function(req, res, next) {
		req.body.author = req.user._id;
		req.body.publishDate = Date.parse(req.body.publishDate);
		Indicative.validateAll(req.body, Validators.article, Validators.messages)
			.then(function() {
				req.body.slug = slug(req.body.slug);
				Article.create(req.body, function(err, article) {
					if (err) console.log(err);
					if (err) next(err);
					else res.json(article);
				});
			})
			.catch(function(errors) {
				var err = new Error("Bad Request");
				err.status = 400;
				err.errors = errors;
				next(err);
			});
	});
router.route('/:article_id')
	.get(auth.public_api(), ratelimit, cache, function(req, res, next) {
		Article.findById(req.params.article_id)
		.populate('author', 'displayName')
		.exec(function(err, article) {
			if (err) next(err);
			if (!article) {
				err = new Error("Article Not Found");
				err.status = 404;
				next(err);
			}
			res.json(article);
		});
	})
	.delete(auth.writer(), function(req, res, next) {
		Article.findById(req.params.article_id, function(err, doc) {
			AWS.deleteImage(doc.header)
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
	.put(auth.writer(), AWS.handleUpload(['header']), function(req, res, next) {
		req.body.publishDate = Date.parse(req.body.publishDate);
		Indicative.validateAll(req.body, Validators.article, Validators.messages)
			.then(function() {
				req.body.slug = slug(req.body.slug);
				Article.findByIdAndUpdate(req.params.article_id, req.body, function(err, article) {
					if (err) next(err);
					if (!article) {
						err = new Error("Article not found");
						err.status = 404;
						next(err);
					} else res.json(article);
				});
			})
			.catch(function(errors) {
				var err = new Error("Bad Request");
				err.status = 400;
				err.errors = errors;
				next(err);
			});
	});
router.get('/slug/:slug', auth.public_api(), ratelimit, cache, function(req, res, next) {
		Article.findOne({
			"slug": req.params.slug
		})
		.select('-tags._id')
		.populate('author','displayName profilePicture')
		.exec(function(err, article) {
			if (err) next(err);
			if (!article) {
				err = new Error("Article Not Found");
				err.status = 404;
				next(err);
			}
			res.json(article);
		});
	})
module.exports = router;
