var fs = require('fs');
var multiparty = require('multiparty');
var path = require('path');

module.exports.saveImage = function(req, res, next) {
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        var file = files.file[0];
        var contentType = file.headers['content-type'];
        var tempPath = file.path;
        var extensionIndex = tempPath.lastIndexOf('.');
        var extension = (extensionIndex < 0) ? '' : tempPath.substr(extensionIndex);
        var fileName = 'poop' + extension;
        var destPath = path.join('test', fileName);
        // Only accept png/jpeg files
        if(contentType !== ('image/png' || 'image/jpeg')) {
            fs.unlink(tempPath);
            return res.status(400).send('Unsupported file type!');
        }
        
        var inputStream = fs.createReadStream(tempPath);
        var outputStream = fs. createWriteStream(destPath);
        
        if(inputStream.pipe(outputStream)) {
            fs.unlink(tempPath, function(err) {
                if(err) console.log(err);
            });
            return res.json(destPath);
        } else return res.json('File not uploaded');
    });
};