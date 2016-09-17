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
		required: true
	},
	game: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Game',
		required: true
	},
	media: [Media],
	icon: String,
	spoiler: {
		type: Boolean,
		default: false
	}
});


var Team = mongoose.model('Teams', teamSchema);

module.exports = Team;
module.exports.schema = teamSchema;
