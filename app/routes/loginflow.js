var router = require('express').Router();

router.use('/facebook', require('./flows/facebook'));
router.use('/twitter', require('./flows/twitter'));

module.exports = router;
