var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Sponsor = require('./sponsor').schema;

var leagueSchema = new Schema({
	leagueName: {
		type: String,
		required: true
	},
	leagueGame: {
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'Game',
		required: true
	},
	leagueStartDate: Date,
	leagueEndDate: Date,
	leagueSponsors: [Sponsor],
	leagueLogo: String,
	leagueBanner: String,
});

var League = mongoose.model('League', leagueSchema);

module.exports = League;
module.exports.schema = leagueSchema;