var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var matchSchema = new Schema({
    identifier: String,
    team1Match: String,
    team2Match: String,
    bestOf: {
        type: Number,
        default: 1
    },
	team1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teams',
        required: false
    },
	team2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teams',
        required: false
    },
    title: String,
	spoiler1: {
		type: Boolean,
		default: false
	},
    spoiler2: {
		type: Boolean,
		default: false
	},
    data: [{
        links: [String],
        twitch: {
            picksBans: String,
            gameStart: String,
        },
        youtube: {
            picksBans: String,
            gameStart: String
        },
        placeholder: {
            type: Boolean,
            default: false
        },
    }]
});

var Match = mongoose.model('Match', matchSchema);
module.exports = Match;
module.exports.schema = matchSchema;