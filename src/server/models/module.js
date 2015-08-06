var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var moduleSchema =  new Schema ({
    moduleEventID: { type: Number, require: true },
    moduleTitle: { type: String, required: true },
    moduleType: { type: String, required: true },
    moduleTeams: String
});

var Module = mongoose.model('modules', moduleSchema);

module.exports = Module;
