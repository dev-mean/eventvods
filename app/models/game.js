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
    banner: String,
});
var Game = mongoose.model('Game', gameSchema);
module.exports = Game;
module.exports.schema = gameSchema;
