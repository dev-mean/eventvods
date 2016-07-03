var router = require('express').Router();
var User = require('../../models/user');
var Indicative = require('indicative');
var Validators = require('../../controllers/validation');

router.get('/session', function(req, res) {
    if (!req.isAuthenticated())
        res.json({
			success: false,
			error: "Not Authenticated"
		});
    else
        res.json(req.user);
});

router.post('/login', function(req, res, next) {
    User.authenticate()(req.body.email, req.body.password, function(err, user, code) {
        if (err) next(err);
        else if (user === false) res.status('400').json(code);
        else req.login(user, function(err) {
            if (err) next(err);
            res.redirect('/api/auth/session');
        });
    });
});
router.post('/register', function(req, res, next){
	Indicative.validateAll(req.body, Validators.register, Validators.messages)
			.then(function() {
				var newUser = new User({
					"email": req.body.email,
					"displayName": req.body.displayName,
					"signup.IP": req.ip,
					"userRights": 5
				});
				User.register(newUser, req.body.password, function(err, user){
					if(err) next(err);
					req.login(user, function(err){
						if (err) next(err);
						res.redirect('/api/auth/session');
					})
				});
			})
			.catch(function(errors) {
				var err = new Error("Bad Request");
				err.status = 400;
				err.errors = errors;
				next(err);
			});
});

module.exports = router;
