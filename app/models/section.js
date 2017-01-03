var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Team = require('./team').schema;
var matchSchema = new Schema({
	//Stage 1-2
	// team1: Team,
	// team2: Team,
	team1_2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teams'
    },
	team2_2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teams'
    },
	//Stage 3
	team1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teams'
    },
	team2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teams'
    },
	team1Sp: Boolean,
	team2Sp: Boolean,
	team1SpText: String,
	team2SpText: String,
	links: [String],
	title: String,
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
});
var moduleSchema = new Schema({
	title: String,
	columns: [String],
	matches: {
		type: [matchSchema]
	},
	matches2: {
		type: [mongoose.Schema.Types.ObjectId],
        ref: 'Match'
    },
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
