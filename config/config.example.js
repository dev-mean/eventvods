module.exports = {
	databaseUrl: '',
	port: process.env.PORT || 5000,
	ip: null,
	secret: '',
	smtp: {
		host: '',
		port: '',
		auth: {
			user: '',
			pass: ''
		}
	},
	logs: {
		token: "",
		subdomain: "",
		username: "",
		password: ""
	},
	redis: {
		"host": "",
		"port": "",
		"auth": "",
	},
	aws: {
		"id": "",
		"secret": ""
	}

};
