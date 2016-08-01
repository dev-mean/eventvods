var app = require('express');
var router = app.Router();
var path = require('path');

router.get('/*', function (req, res) {
	res.sendFile(path.resolve(__dirname + '/../../app/views/frontend.html'));
});


module.exports = router;
