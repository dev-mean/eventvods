module.exports = {
	"databaseUrl": process.env.DB || '',
	"port": process.env.PORT || 5000,
	"secret": process.env.SECRET || '',
	"smtp": {
		"host": process.env.SMTP_HOST || '',
		"port": process.env.SMTP_PORT || '',
		"auth": {
			"user": process.env.SMTP_USER || '',
			"pass": process.env.SMTP_PASS || ''
		}
	},
	"logs": {
		"token": process.env.LOGS_TOKEN || "",
		"subdomain": process.env.LOGS_DOMAIN || "",
		"username": process.env.LOGS_USER || "",
		"password": process.env.LOGS_PASS || ""
	},
	"redis": {
		"host": process.env.REDIS_HOST || "",
		"port": process.env.REDIS_PORT || "",
		"auth": process.env.REDIS_AUTH || "",
	},
	"aws": {
		"key": process.env.AWS_KEY || "",
		"secret": process.env.AWS_SECRET || "",
		"bucket": process.env.AWS_BUCKET || "",
		"cdn": process.env.AWS_CDN || ""
	},
	"prerender": process.env.PRERENDER_TOKEN,
	"staffRoles": ['Analyst', 'Caster', 'Coach', 'Host', 'Translator', 'Player', 'Mixed', 'Other'],
	"mediaTypes": ['Website', 'Twitter', 'Facebook', 'Twitch', 'Youtube', 'Stream (Other)', 'Other','Wiki']
};
