const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const fileSchema = new Schema({
    userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User'},
    Dataset: {type:Object, require:true}
});

module.exports = mongoose.model('File', fileSchema);