var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SocialMedia = require('./socialmedia').schema;

var organizationSchema = new Schema ({
    organizationName: { type: String, required: true },
    organizationMedia: [SocialMedia],
    organizationImage: String
});

var Organization = mongoose.model('organizations', organizationSchema);

module.exports = Organization;
