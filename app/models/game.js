var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var gameSchema = new Schema({
    gameName: {
        type: String,
        required: true
    },
    gameAlias: {
        type: String,
        required: true,
        unique: true
    },
    gameIcon: String,
    gameBanner: String,
});
var Game = mongoose.model('Game', gameSchema);
module.exports = Game;
module.exports.schema = gameSchema;
