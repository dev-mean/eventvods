var redis = require('./redis');
var RateLimit = require('ratelimit.js').RateLimit;
var ExpressMiddleware = require('ratelimit.js').ExpressMiddleware;

var rules = [{
	interval: 60,
	limit: 30
}];

var limiter = new RateLimit(redis, rules, {prefix: ':ratelimit'});
var factory = new ExpressMiddleware(limiter, {
	getIdentifiers: function(req){
		return req.user._id || req.ip;
	}
});
var middleware = factory.middleware(function(req, res, next){
	res.sendStatus(429);
})

module.exports = function(req, res, next) {
	if (req.ignoreRatelimit)
		next();
	else
		middleware(req, res, next);
}
