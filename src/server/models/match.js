var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var matchSchema = new Schema({
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

var Match = mongoose.model('matchs', matchSchema);

module.exports = Match;
