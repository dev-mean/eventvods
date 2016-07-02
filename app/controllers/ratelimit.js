var RateLimitjs = require('ratelimit.js')
	.RateLimit;
var ExpressMiddleware = require('ratelimit.js')
	.ExpressMiddleware;
var redis = require('./redis');
// TODO:
// doesn't work...
// next() is never called?
// either way, requests hang
// Essentially:
// Max 12 requests per second (one full update of all API routes = 12 calls)
// & 24 requests per minute
// & 192 requests per hour
var limiter = new RateLimitjs(redis, [{
	interval: 1,
	limit: 12
}, {
	interval: 60,
	limit: 24
}, {
	interval: 3600,
	limit: 192
}], {
	prefix: ':ratelimit'
});
var middlewareFactory = new ExpressMiddleware(limiter, {
	ignoreRedisErrors: true
});
var ratelimit = middlewareFactory.middleware({
	extractIps: function(req) {
		return req.ip;
	}
}, function(req, res, next) {
	var err = new Error("Rate Limit Exceeded");
	err.status = 429;
	next(err);
});

module.exports = function rateLimitCheck(req, res, next) {
	//skip until fixed
	req.ignoreRatelimit = true;
	if (req.ignoreRatelimit)
		next();
	else
		return ratelimit;
}
