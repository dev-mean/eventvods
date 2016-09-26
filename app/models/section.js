var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Team = require('./team').schema;

var matchSchema = {
	team1: Team,
	team2: Team,
	links: [String],
	twitch: {
		picksBans: String,
		gameStart: String,
	},
	youtube: {
		picksBans: String,
		gameStart: String
	},
	spoiler: {
		type: Boolean,
		default: false
	},
	placeholder: {
		type: Boolean,
		default: false
	}
}
var moduleSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	columns: [String],
	matches: [matchSchema],
	twitch: Boolean,
	youtube: Boolean
});
var sectionSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	modules: [moduleSchema]
});
var Section = mongoose.model('Section', sectionSchema);
module.exports = Section;
module.exports.schema = sectionSchema;
