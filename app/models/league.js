var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Staff = require('./staff').schema;
var Media = require('./socialmedia').schema;
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
	staff: [Staff],
	media: [Media],
	logo: String,
	header: String,
});

var League = mongoose.model('League', leagueSchema);

module.exports = League;
module.exports.schema = leagueSchema;
