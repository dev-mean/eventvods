var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SocialMedia = require('./socialmedia').schema;

var staffSchema = new Schema({
	staffName: {
		type: String,
		required: true
	},
	staffAlias: {
		type: String,
		required: true
	},
	staffMedia: [SocialMedia],
	staffCountry: String,
	staffRole: String
});

var Staff = mongoose.model('staff', staffSchema);

module.exports = Staff;
module.exports.schema = staffSchema;
