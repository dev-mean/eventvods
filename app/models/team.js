var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Media = require('./socialmedia').schema;

var teamSchema = new Schema({
	name: {
		type: String
	},
	tag: {
		type: String
	},
	slug: {
		type: String,
		required: true,
		unique: true
	},
	media: [Media],
	icon: String
});


var Team = mongoose.model('Teams', teamSchema);

module.exports = Team;
module.exports.schema = teamSchema;
