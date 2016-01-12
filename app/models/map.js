var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mapSchema = new Schema({
	mapImage: String,
	mapGame: {
		type: String,
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
