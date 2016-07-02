var router = require('express').Router();
var config = require('../../../config/config');
var auth = require('../../controllers/auth');

//Specific static data
router.get('/staffRoles', auth.public_api(), function(req, res, next){
    res.json(config.staffRoles);
});

module.exports = router;
