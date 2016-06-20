var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Round = require('./round').schema;

var matchSchema = new Schema({
	matchStatus: { type: String, enum: ['Upcoming', 'Live', 'Finished'] },
    matchDate: { type: Date, required: true },
    matchType: String,
    matchRounds: [Round],
    matchTeam1: { type: Number, required: true },
    matchTeam2: { type: Number, required: true },
    matchTeam1Wins: Number,
    matchTeam2Wins: Number,
    matchWinner: String
});

var Match = mongoose.model('matchs', matchSchema);

module.exports = Match;
module.exports.schema = matchSchema;
