var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mapSchema = new Schema({
		mapName: { type: String, required: true },
		sampleImage: String
});

var Map = mongoose.model('Map', mapSchema);

module.exports = Map;
