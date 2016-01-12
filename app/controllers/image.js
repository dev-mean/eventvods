var fs = require('fs');
var multer = require('multer');
var path = require('path');
var upload = multer({
	dest: path.join(__dirname, '..', 'uploads')
});

/* Exports multer config, will be useful to separate into this controller
 ** when custom storage comes into play.
 */
module.exports.upload = upload;
