var app = require('express');
var router = app.Router();
var auth = require('../controllers/auth.js');
var User = require('../models/user.js');
var Indicative = require('indicative');
var Validators = require('../controllers/validation.js');

router.get('/list', function () {
    User.find(function (err, users) {
        console.log(users);
    });
});

router.route('/login')
    .get(function (req, res) {
        res.render('user/login', {
            errors: []
        });
    })
    .post(function (req, res) {
        User.authenticate()(req.body.username, req.body.password, function (err, user, options) {
            if (err) next(err);
            if (user === false) {
                res.render('user/login', {
                    errors: [
						"Invalid username or password."
					]
                });
            } else {
                user.lastLogin = Date.now();
                user.lastIP = req.ip;
                user.save();
                req.login(user, function (err) {
                    res.redirect(req.session.returnTo || '/');
                });
            }
        });
    });

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.route('/register')
    .get(function (req, res) {
        res.render('user/register', {
            errors: []
        });
    })
    .post(function (req, res) {
        Indicative
            .validateAll(req.body, Validators.register, Validators.messages)
            .then(function () {
                User.register(new User({
                    username: req.body.Username,
                    userRights: auth.constants.admin,
                    userEmail: req.body.Email,
                    signupIP: req.ip
                }), req.body.Password, function (err, user) {
                    if (err) {
                        next(err);
                    } else {
                        req.login(user, function (err) {
                            res.redirect(req.session.returnTo || '/');
                        });
                    }
                });
            })
            .catch(function (errors) {
                res.render('user/register', {
                    errors: errors
                });
            });

    });

module.exports = router;
