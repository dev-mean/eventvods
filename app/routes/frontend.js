var app = require('express');
var router = app.Router();
var path = require('path');
var sitemap = require('../controllers/sitemap.js');

router.use('/login', require('./loginflow.js'));

router.get('/sitemap.xml', function(req, res, next){
	sitemap.sitemap()
		.then((sitemap) => {
			res.set('Content-Type', 'application/xml');
			res.send(sitemap);
		})
		.catch((err) => {
			res.sendStatus('500');
		})
})

router.get('/*', function (req, res) {
	res.sendFile(path.resolve(__dirname + '/../../app/views/frontend.html'));
});



module.exports = router;
