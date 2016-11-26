var app = require('express');
var router = app.Router();
var auth = require('../controllers/auth');
var User = require('../models/user');
var path = require('path');

router.get('/*', auth.writer(), function(req, res) {
    if (process.env.NODE_ENV === "development") res.sendFile(path.resolve(__dirname + '/../../app/views/admin.html'));
    else res.sendFile(path.resolve(__dirname + '/../../app/views/backend.html'));
});


module.exports = router;