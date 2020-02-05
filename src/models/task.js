const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

const Task = new Schema({
    description: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true, }
},
    { timestamps: true });

module.exports = mongoose.model('Tasks', Task);