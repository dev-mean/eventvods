module.exports = {
	databaseUrl: 'nkane:password@ds031627.mongolab.com:31627/eventvods',
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
		"auth": "",
	}

};
