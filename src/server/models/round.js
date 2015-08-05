var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roundSchema = new Schema({
    roundMatchID: { type: Number, required: true },
    roundNumber: Number,
    roundResult: String,
    roundTwitch: String,
    roundYoutube: String,
    roundHighlights: String,
    roundDemo: Array
});

var Round = mongoose.model('Round', roundSchema);

module.exports = Round;
