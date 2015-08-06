var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var organizationSchema = new Schema ({
    organizationName: { type: String, required: true },
    organizationWebsite: String,
    organizationImage: String
});

var Organization = mongoose.model('organizations', organizationSchema);

module.exports = Organization;
