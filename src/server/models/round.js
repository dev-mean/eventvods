var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Link = require('./link').schema;

var roundSchema = new Schema({
    roundTeam1: { type: String, required: true },
	roundTeam2: { type: String, required: true },
	roundlinks: [Link],
});

var Round = mongoose.model('rounds', roundSchema);

module.exports = Round;
