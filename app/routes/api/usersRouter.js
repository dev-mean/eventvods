var router = require('express').Router();
var User = require('../../models/user');
var auth = require('../../controllers/auth');
var Indicative = require('indicative');
var Validators = require('../../controllers/validation');

router.post('/displayName', auth.logged_in(true), function(req, res, next){
	Indicative.validate(req.body, Validators.name, Validators.messages)
		.then(function(){
			User.findByIdAndUpdate(req.user._id, {
				displayName: req.body.Name.toUpperCase()
			}, function(err, user){
				if(err) next(err);
				else res.sendStatus('204');
			});
		})
		.catch(function(err){
			res.status('400').send(err);
		});

});

module.exports = router;
