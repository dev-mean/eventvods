var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var gameSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    icon: String,
    header: String,
	header_blur: String,
});
var Game = mongoose.model('Game', gameSchema);
module.exports = Game;
module.exports.schema = gameSchema;
