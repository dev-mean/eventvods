var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var socialMediaSchema = new Schema({
	type: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	link: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model('SocialMedia', socialMediaSchema);
module.exports.schema = socialMediaSchema;
