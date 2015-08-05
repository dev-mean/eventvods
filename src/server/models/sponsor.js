var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sponsorSchema = new Schema({
    sponsorName: { type: String, required: true },
    sponsorWebsite: String,
    sponsorImage: String
});

var Sponsor = mongoose.model('Sponsor', sponsorSchema);

module.exports = Sponsor;
