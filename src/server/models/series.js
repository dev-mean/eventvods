var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var seriesSchema = new Schema({
    seriesName: { type: String, required: true },
    seriesWebsite: String,
    seriesImage: String
});

var Series = mongoose.model('Series', seriesSchema);

module.exports = Series;
