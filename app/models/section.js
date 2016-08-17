var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Team = require('./team').schema;

var matchSchema = {
	team1: Team,
	team2: Team,
	links: [String],
	spoiler: {
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
	matches: [matchSchema]
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
