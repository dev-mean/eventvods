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
	}
};
