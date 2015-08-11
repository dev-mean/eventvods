var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SocialMedia = require('./socialmedia').schema;

var teamSchema = new Schema({
	teamName: String,
	teamGame: String,
	teamMedia: [SocialMedia],
	teamCountry: String,
	teamImage: String,
	teamIcon: String
});

var Team = mongoose.model('teams', teamSchema);

module.exports = Team;
module.exports.schema = teamSchema;