var router = require('express').Router();
var auth = require('../../controllers/auth');
var ratelimit = require('../../controllers/ratelimit');
var Indicative = require('indicative');
var Validators = require('../../controllers/validation');
var Q = require('q');
var Mail = require('../../models/mail');

router.get('/unresolved', auth.updater(), function(req, res, next){
    Mail.find({resolved: false})
        .count()
        .exec((err, count) => {
            if(err) next(err);
            else res.json({unresolved: count})
        })
})

router.route('/')
	.get(auth.updater(), (req, res, next) => {
		Mail.find()
		.sort('-sentTime')
		.exec(function(err, mails) {
			if (err) next(err);
			else res.json(mails);
		});
	})
	.post(auth.public_api(), ratelimit, (req, res, next) => {
		Indicative.validateAll(req.body, Validators.mail, Validators.messages)
			.then(function() {
				Mail.create(req.body, function(err, mail) {
					if (err) next(err);
					else res.sendStatus('204');
				});
			})
			.catch(function(errors) {
				var err = new Error("Bad Request");
				err.status = 400;
				err.errors = errors;
				next(err);
			});
	});
router.route('/:mail_id')
	.get(auth.updater(), (req, res, next) => {
		Mail.findById(req.params.mail_id)
		.exec(function(err, mail) {
			if (err) next(err);
			if (!mail) {
				err = new Error("Mail Not Found");
				err.status = 404;
				next(err);
			}
			else res.json(mail);
		});
	})
router.get('/:mail_id/resolve', auth.updater(), (req, res, next) => {
    Mail.findByIdAndUpdate(req.params.mail_id, {resolved: true})
        .exec(function(err, mail) {
			if (err) next(err);
			if (!mail) {
				err = new Error("Mail Not Found");
				err.status = 404;
				next(err);
			}
			else res.json(mail);
		});
})
module.exports = router;
