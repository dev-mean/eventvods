var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SocialMedia = require('./socialmedia')
	.schema;

var staffSchema = new Schema({
	staffForename: {
		type: String,
		required: true
	},
	staffSurname: {
		type: String,
		required: true
	},
	staffAlias: {
		type: String,
		required: true
	},
	staffMedia: [SocialMedia],
	staffRole: String,
	staffPhoto: String
}, {
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true
	}
});

staffSchema.virtual('staffName')
	.get(function() {
		return this.staffForename + ' ' + this.staffSurname;
	});

var Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;
module.exports.schema = staffSchema;