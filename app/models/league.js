var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Sponsor = require('./sponsor').schema;
var slug = require('slug');

var leagueSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	game: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Game',
		required: true
	},
	slug: {
		type: String,
		required: true,
		unique: true
	},
	startDate: Date,
	endDate: Date,
	sponsors: [Sponsor],
	logo: String,
	header: String,
});

var League = mongoose.model('League', leagueSchema);

module.exports = League;
module.exports.schema = leagueSchema;
