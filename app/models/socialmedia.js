var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var socialMediaSchema = new Schema({
	type: {
		type: String
	},
	name: {
		type: String
	},
	link: {
		type: String
	}
});

module.exports = mongoose.model('SocialMedia', socialMediaSchema);
module.exports.schema = socialMediaSchema;
