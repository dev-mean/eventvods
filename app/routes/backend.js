var app = require('express');
var router = app.Router();
var auth = require('../controllers/auth');
var User = require('../models/user');
var path = require('path');

router.get('/*', auth.writer(), function(req, res) {
	res.sendFile(path.resolve(__dirname + '/../../app/views/backend.html'));
});


module.exports = router;
