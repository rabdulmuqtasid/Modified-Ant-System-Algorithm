const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const fileSchema = new Schema({
    userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User'},
    Dataset: {type:Object, require:true},
    createdAt: { type: Date, expires: '1d', default: Date.now }
});

fileSchema.plugin(uniqueValidator);

module.exports = mongoose.model('File', fileSchema);