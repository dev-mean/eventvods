var router = require('express').Router();

router.use('/facebook', require('./flows/facebook'));

module.exports = router;
