//requires
    var path = require('path');
    var fs = require('fs');

//routez
    module.exports = function(app, passport) {
        
        //home page
        app.get('/', function(req, res) {
            res.render(path.join(__dirname, '..', '..', 'public/index.ejs'));
        });
        
    };