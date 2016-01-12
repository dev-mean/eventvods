var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SocialMedia = require('./socialmedia').schema;

var teamSchema = new Schema({
	teamName: String,
	teamTag: String,
	teamGame: String,
	teamMedia: [SocialMedia],
	teamCountry: String,
	teamImage: String,
	teamIcon: String,
	lastUpdated: Date
});

teamSchema.pre('save', function(next){
	this.lastUpdated = new Date();
	next();
});

var Team = mongoose.model('teams', teamSchema);

module.exports = Team;
module.exports.schema = teamSchema;