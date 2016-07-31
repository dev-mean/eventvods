var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SocialMedia = require('./socialmedia')
	.schema;

var staffSchema = new Schema({
	forename: {
		type: String,
		required: true
	},
	surname: {
		type: String,
		required: true
	},
	alias: {
		type: String,
		required: true
	},
	slug: {
		type: String,
		required: true,
		unique: true
	},
	media: [SocialMedia],
	role: {
		type: String,
		required: true
	},
	photo: String
}, {
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true
	}
});

staffSchema.virtual('name')
	.get(function() {
		return this.forename + ' "' + this.alias + '" ' + this.surname;
	});

var Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;
module.exports.schema = staffSchema;
