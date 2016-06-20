var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var socialMediaSchema = new Schema({
	mediaType: {
		type: String,
		required: true
	},
	mediaName: {
		type: String,
		required: true
	},
	mediaURL: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model('SocialMedia', socialMediaSchema);
module.exports.schema = socialMediaSchema;
