module.exports = {
	databaseUrl: 'simon_dev:password@ds015690.mlab.com:15690/ev_dev',
	port: process.env.PORT || 5000,
	ip: null,
	secret: 'eventvods_dev',
	smtp: {
		host: 'smtp.sendgrid.net',
		port: '25',
		auth: {
			user: 'eventvods',
			pass: ''
		}
	},
	logs: {
		token: "a764c56e-8447-4160-9674-70aad0e76839",
		subdomain: "eventvods",
		username: "eventvods",
		password: ""
	},
	redis: {
		"host": "pub-redis-12018.us-east-1-3.7.ec2.redislabs.com",
		"port": "12018",
		"auth": "Testing123",
	},
	aws: {
		"id": "AKIAI4A3ZWN2AEGBEQPQ",
		"secret": "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"
	}
};
