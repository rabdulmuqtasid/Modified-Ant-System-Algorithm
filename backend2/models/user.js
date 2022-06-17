const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const userSchema = new Schema({
    userId: { type: String, required: true },
    Dataset: [{ type: mongoose.Types.ObjectId, required: true, ref: 'File'}]
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);


