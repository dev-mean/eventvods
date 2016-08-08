var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Staff = require('./staff').schema;
var Media = require('./socialmedia').schema;
var Team = require('./team').schema;
var slug = require('slug');
var Section = require('./section').schema;
var leagueSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	game: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Game',
		required: true
	},
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
	contents: [Section]
});

var League = mongoose.model('League', leagueSchema);

module.exports = League;
module.exports.schema = leagueSchema;
