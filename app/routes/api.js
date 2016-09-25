var app = require('express');
var router = app.Router();
var logger = require('bristol');
var async = require('async');

router.all('*', function(req, res, next){
	if(req.isAuthenticated() && req.user.userRights > 1) res.use_express_redis_cache = false;
	next();
})

//General routes
router.use('/validate', require('./api/validateRouter'));
router.use('/auth', require('./api/authRouter'));
router.use('/data', require('./api/staticRouter'));

//Model CRUD Routes
router.use('/overview', require('./api/overviewRouter'));
router.use('/featured', require('./api/featuredRouter'));
router.use('/articles', require('./api/articlesRouter'));
router.use('/games', require('./api/gamesRouter'));
router.use('/staff', require('./api/staffRouter'));
router.use('/teams', require('./api/teamsRouter'));
router.use('/users', require('./api/usersRouter'));
router.use('/user', require('./api/userRouter'));
router.use('/leagues', require('./api/leaguesRouter'));
router.use('/tournaments', require('./api/tournamentsRouter'));

// 404 handler
router.use(function(req, res, next) {
	var err = new Error("Invalid API route");
	err.status = 404;
	next(err);
});

// prints stacktrace only in dev mode
router.use(function(err, req, res, next) {
	res.status(err.status || 500);
	if (err.status == 403 || err.status == 401 || err.status == 404 || err.status == 429) logger.warn(err);
	else logger.error(err);
	if (process.env.NODE_ENV == "development" || app.get('env') == "development") res.json({
		"status": err.status,
		"message": err.message,
		"errors": err.errors,
		"stack": err.stack
	});
	else res.json({
		"status": err.status,
		"errors": err.errors,
		"message": err.message
	});
});
module.exports = router;
