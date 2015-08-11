var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SocialMedia = require('./socialmedia').schema;
						  
var casterSchema = new Schema({
    casterName: { type: String, required: true},
    casterAlias: { type: String, required: true },
	casterMedia: [SocialMedia],
    casterCountry: String,
    casterImage: String
});

var Caster = mongoose.model('caster', casterSchema);

module.exports = Caster;
module.exports.schema = casterSchema;