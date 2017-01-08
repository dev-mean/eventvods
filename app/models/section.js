var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Team = require('./team').schema;

var moduleSchema = new Schema({
	title: String,
	columns: [String],
	matches2: {
		type: [mongoose.Schema.Types.ObjectId],
        ref: 'Match'
    },
	date: Date,
	twitch: Boolean,
	youtube: Boolean
});
var sectionSchema = new Schema({
	title: String,
	modules: [moduleSchema],
	draftText: String
});
var Section = mongoose.model('Section', sectionSchema);
module.exports = Section;
module.exports.schema = sectionSchema;
module.exports.module = moduleSchema;
