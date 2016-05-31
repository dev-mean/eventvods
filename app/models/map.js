var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mapSchema = new Schema({
	mapImage: String,
	mapGame: {
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'Game',
		required: true
	},
	mapName: {
		type: String,
		required: true
	},
});

var Map = mongoose.model('maps', mapSchema);

module.exports = Map;
module.exports.schema = mapSchema;
