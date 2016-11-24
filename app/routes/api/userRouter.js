var router = require('express').Router();
var User = require('../../models/user');
var auth = require('../../controllers/auth');
var Indicative = require('indicative');
var Validators = require('../../controllers/validation');
var email = require('../../controllers/email');
var ResetToken = require('../../models/resetToken');
var moment = require('moment');

router.post('/displayName', auth.logged_in(true), function(req, res, next) {
    Indicative.validate(req.body, Validators.name, Validators.messages)
        .then(() => {
            User.findByIdAndUpdate(req.user._id, {
                displayName: req.body.Name.toUpperCase()
            }, function(err, user) {
                if (err) next(err);
                else res.sendStatus('204');
            });
        })
        .catch((err) => {
            res.status('400').send(err);
        });

});
router.post('/following', auth.logged_in(true), function(req, res, next) {
    User.findByIdAndUpdate(req.user._id, {
        following: req.body
    }, function(err, user) {
        if (err) next(err);
        else res.sendStatus('204');
    });
});
router.post('/settings', auth.logged_in(true), function(req, res, next) {
    User.findByIdAndUpdate(req.user._id, {
        settings: req.body
    }, function(err, user) {
        if (err) next(err);
        else res.sendStatus('204');
    });
});
router.post('/email', auth.logged_in(true), function(req, res, next) {
    if (!req.body.confirm_pw) return res.sendStatus('403');
    User.findById(req.user._id, function(err, user) {
        if (err) next(err);
        user.authenticate(req.body.confirm_pw, function(err, validUser, pwMessage) {
            if (err) next(err);
            if (validUser === false) res.sendStatus('403');
            else if (Indicative.is.email(req.body.email)) {
                req.user.email = req.body.email;
                req.user.save((err) => {
                    if (err) next(err);
                    else {
                        req.logout();
                        return res.sendStatus('204');
                    }
                });
            } else return res.sendStatus('400');
        });
    });
});
router.post('/password', auth.logged_in(true), function(req, res, next) {
    if (!req.body.current_pw) return res.sendStatus('403');
    User.findById(req.user._id, function(err, user) {
        if (err) next(err);
        user.authenticate(req.body.current_pw, function(err, validUser, pwMessage) {
            if (err) next(err);
            if (validUser === false) res.sendStatus('403');
            else Indicative.validateAll(req.body, Validators.password, Validators.messages)
                .then(() => {
                    validUser.setPassword(req.body.password, function(err, updatedModel, pwMessage) {
                        if (err) next(err);
                        updatedModel.save((err) => {
                            if (err) next(err);
                            else {
                                req.logout();
                                return res.sendStatus('204');
                            }
                        });
                    })
                })
                .catch(() => {
                    var err = new Error("Bad Request");
                    err.status = 400;
                    next(err);
                });
        });
    });
});
router.post('/reset', function(req, res, next) {
    if (Indicative.is.email(req.body.email) &&
        Indicative.is.existy(req.body.password) &&
        req.body.password === req.body.password_confirm &&
        req.body.password.length >= 6 &&
        req.body.password.length <= 100) {

        User.findOne({
                email: req.body.email
            })
            .exec((err, user) => {
                if (err) next(err);
                if (!user) res.sendStatus('204');
                else {
                    ResetToken.remove({
                        user: user._id
                    }, (err) => {
                        if (err) next(err);
                        ResetToken.create({
                            user: user._id,
                            newPassword: req.body.password
                        }, (err, token) => {
                            if (err) next(err);
                            else email.passwordReset(req.body.email, token)
                                .then(() => {
                                    res.sendStatus('204');
                                });
                        });
                    });
                }
            })
    } else res.sendStatus('400');
});
router.get('/reset/:id/:token', function(req, res, next) {
    var invalid = "Invalid or out-dated confirmation token. Please make sure you've copied the link correctly, or try resetting your password again.";
    ResetToken.findById(req.params.id)
        .populate('user')
        .exec((err, token) => {
            if (!token || moment().isAfter(moment(token.expiry))) return res.send(invalid);
            if (err) next(err);
            if (req.params.token === token.token)
                token.user.setPassword(token.newPassword, (err) => {
                    if (err) next(err);
                    token.user.save((err) => {
                        if (err) next(err);
                        else {
                            req.login(token.user, () => {
                                token.remove((err) => {
                                    res.redirect('/');
                                })
                            });
                        }
                    })
                })
            else res.send(invalid);
        });
});
router.get('/sendEmail', auth.logged_in(true), function(req, res, next) {
    User.findById(req.user._id, (err, user) => {
        if (err) next(err);
        else if (!user.emailConfirmation.sent) {
            email.sendVerification(user)
                .then(() => {
                    user.emailConfirmation.sent = true;
                    user.save((err) => {
                        if (err) next(err);
                        else res.sendStatus('204');
                    })
                })
        }
    });
});

router.get('/verify/:id/:code', auth.logged_in(true), function(req, res, next) {
    User.findById(req.user._id, function(err, user) {
        if (err) next(err);
        if (req.params.id != req.user._id) res.status('403').send('Authentication mismatch. Please make sure you\'re logged into the account before confirming your email');
        else if (req.params.code != user.code) res.status('400').send('Invalid confirmation code.');
        else {
            user.emailConfirmation.confirmed = true;
            user.save((err) => {
                if (err) next(err);
                else res.redirect('/user/settings?tab=1');
            });
        }

    });
});

module.exports = router;