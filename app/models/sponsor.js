var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sponsorSchema = new Schema({
    sponsorName: { type: String, required: true },
    sponsorWebsite: { type: String, required: true}
});

var Sponsor = mongoose.model('sponsors', sponsorSchema);

module.exports = Sponsor;
module.exports.schema = sponsorSchema;
