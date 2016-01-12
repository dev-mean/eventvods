var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var linkSchema = new Schema({
    linkText: { type: String, required: true },
	linkURL: { type: String, required: true },
	linkSpoiler: {type: Boolean, default: false }
});

module.exports = mongoose.model('Link', linkSchema);
module.exports.schema = linkSchema;
