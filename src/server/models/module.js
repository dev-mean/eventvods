var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var moduleSchema =  new Schema ({
    moduleID: { type: Number, required: true, unique: true },
    moduleEventID: { type: Number, require: true },
    moduleTitle: { type: String, required: true },
    moduleType: { type: String, required: true },
    moduleTeams: String
});

var Module = mongoose.model('Module', moduleSchema);

module.exports = Module;
