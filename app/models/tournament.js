var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Staff = require('./staff').schema;
var Media = require('./socialmedia').schema;
var Team = require('./team').schema;
var slug = require('slug');
var Section = require('./section').schema;
var moment = require('moment');

var tournamentSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	subtitle: String,
	shortTitle: String,
	textOrientation: String,
	slug: {
		type: String,
		required: true,
		unique: true
	},
	startDate: Date,
	endDate: Date,
	staff: [Staff],
	media: [Media],
	teams: [Team],
	logo: String,
	header: String,
	header_blur: String,
	contents: [Section]
}, {
	timestamps: true,
	id: false,
	toJSON: {
		virtuals: true,
	},
	toObject: {
		virtual: true,
	}
});

tournamentSchema.virtual('updated').get(function () {
	var updated;
	if(typeof this.updatedAt === "undefined" && typeof this.createdAt === "undefined") return "";
	var updated = (typeof this.updatedAt === "undefined") ? this.createdAt : this.updatedAt;
  	return "Updated "+moment(updated).fromNow();
});

var Tournament = mongoose.model('Tournament', tournamentSchema);

module.exports = Tournament;
module.exports.schema = tournamentSchema;
