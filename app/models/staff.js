var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SocialMedia = require('./socialmedia')
	.schema;

var staffSchema = new Schema({
	forename: {
		type: String
	},
	surname: {
		type: String
	},
	alias: {
		type: String
	},
	slug: {
		type: String,
		required: true
	},
	media: [SocialMedia],
	role: String,
	photo: String
}, {
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true
	},
	id: false
});

staffSchema.virtual('name')
	.get(function() {
		return this.forename + ' "' + this.alias + '" ' + this.surname;
	});

var Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;
module.exports.schema = staffSchema;
