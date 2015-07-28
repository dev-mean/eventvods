var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var seriesSchema = new Schema({
    seriesID: { type: Number, required: true, unique: true },
    seriesName: { type: String, required: true },
    seriesWebsite: String,
    seriesImage: String
});

var Series = mongoose.model('Series', seriesSchema);

module.exports = Series;
