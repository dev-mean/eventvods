var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var matchSchema = new Schema({
    matchID: { type: Number, required: true, unique: true },
    matchDate: Date,
    matchTime: String,
    matchType: String,
    matchRounds: Number,
    matchTeam1: String,
    matchTeam2: String,
    matchTeam1Wins: Number,
    matchTeam2Wins: Number,
    matchWinner: String
});

var Match = mongoose.model('Match', matchSchema);

module.exports = Match;
