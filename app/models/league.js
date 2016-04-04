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
	leagueSponsors: [Sponsor]
});

var League = mongoose.model('League', leagueSchema);

module.exports = League;
module.exports.schema = leagueSchema;
