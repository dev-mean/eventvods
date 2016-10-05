var router = require('express').Router();
var User = require('../../models/user');
var Indicative = require('indicative');
var Validators = require('../../controllers/validation');
var async = require('async');

router.get('/session', function(req, res) {
    if (!req.isAuthenticated())
        res.sendStatus('204');
    else
		res.json(req.user);
});

router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

router.post('/login', function(req, res, next) {
	console.log(req.body);
    User.authenticate()(req.body.email, req.body.password, function(err, user, code) {
        if (err) next(err);
        else if (user === false) res.status('400').send(code.message);
        else req.login(user, function(err) {
            if (err) next(err);
            res.redirect('/api/auth/session');
        });
    });
});
router.post('/register', function(req, res, next){
	Indicative.validateAll(req.body, Validators.register, Validators.messages)
			.then(function() {
				async.parallel({
					name: function(cb){
						User.count({
							displayName: req.body.displayName.toUpperCase()
						}, function(err, count){
							if(err) cb(err);
							else cb(null, count);
						});
					},
					email: function(cb){
						User.count({
							email: req.body.email
						}, function(err, count){
							if(err) cb(err);
							else cb(null, count);
						});
					}
				}, function(err, data){
					if(err) next(err);
					err = [];
					if(data.name > 0) err.push({
						"field": "#register #name",
						"message": "That display name is already in use."
					});
					if(data.email > 0) err.push({
						"field": "#register #email",
						"message": "That email address is already registered."
					});
					if(err.length > 0) res.status('400').json(err);
					else {
						var newUser = new User({
							"email": req.body.email,
							"displayName": req.body.displayName.toUpperCase(),
							"signup.IP": req.ip,
							"userRights": require('../../controllers/auth').constants.logged_in,
							"social": req.body.flow_create ? req.session.flow_create.social : {},
							"profilePicture": req.body.flow_create ? req.session.flow_create.photo : "http://i.imgur.com/tep1kEd.png"
						});
						User.register(newUser, req.body.password, function(err, user){
							if(err) next(err);
							req.login(user, function(err){
								if (err) next(err);
								res.redirect('/api/auth/session');
							});
						});
					}
				});


			})
			.catch(function(errors) {
				res.status('400').json(errors);
			});
});

module.exports = router;
