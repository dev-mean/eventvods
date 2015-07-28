var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var casterSchema = new Schema({
    casterID: { type: Number, required: true, unique: true },
    casterName: String,
    casterAlias: { type: String, required: true },
    casterWebsite: String,
    casterCountry: String,
    casterImage: String
});

var User = mongoose.model('Caster', casterSchema);

module.exports = User;
