var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Sponsor = require('./sponsor').schema;
var slug = require('slug');

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
	leagueSlug: {
		type: String,
		required: true,
		unique: true
	},
	leagueStartDate: Date,
	leagueEndDate: Date,
	leagueSponsors: [Sponsor],
	leagueLogo: String,
	leagueHeader: String,
});

var League = mongoose.model('League', leagueSchema);

module.exports = League;
module.exports.schema = leagueSchema;
