var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mapSchema = new Schema({
		mapImage: String,
		mapGame: String,
		mapName: { type: String, required: true },
});

var Map = mongoose.model('maps', mapSchema);

module.exports = Map;
module.exports.schema = mapSchema;
