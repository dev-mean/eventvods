var redis = require('./redis');
var logger = require('bristol');

// Set up caching middleware
var cache = require('express-redis-cache')({
	client: redis,
	prefix: ':cache',
	expire: 900
});
cache.on('error', function(err) {
		logger.error(err);
	});

module.exports = cache.route();
