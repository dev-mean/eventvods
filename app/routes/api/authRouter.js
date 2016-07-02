var router = require('express').Router();
var User = require('../../models/user');

router.get('/session', function(req, res) {
    if (!req.isAuthenticated())
        return res.sendStatus('401');
    else
        res.json(req.user);
});

router.post('/login', function(req, res, next) {
    User.authenticate()(req.body.email, req.body.password, function(err, user, code) {
        if (err) next(err);
        else if (user === false) res.status('400').json(code);
        else req.login(user, function(err) {
            if (err) next(err);
            res.json(user);
        });
    });
});

module.exports = router;
