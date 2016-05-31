var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SocialMedia = require('./socialmedia').schema;

var teamSchema = new Schema({
	teamName: {
		type: String,
		required: true
	},
	teamTag: {
		type: String,
		required: true
	},
	teamMedia: [SocialMedia],
	teamIcon: String
});


var Team = mongoose.model('Teams', teamSchema);

module.exports = Team;
module.exports.schema = teamSchema;