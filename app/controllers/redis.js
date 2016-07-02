var config = require('../../config/config');
var logger = require('bristol');
// Redis is magic basically
var redis = require('redis')
	.createClient(config.redis.port, config.redis.host, {
		auth_pass: config.redis.auth,
		prefix: 'ev'
	});
redis.on('connect', function() {
	logger.info('Redis server online.');
});

module.exports = redis;
