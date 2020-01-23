const mongoose = require('mongoose');
var validator = require('validator');
const Schema = mongoose.Schema;

const User = new Schema({
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid")
            }
        }

    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password should not contain "password"')
            }
        }
    },
    age: {
        type: Number,
        required: true,
        default: 0
    }
})
module.exports = mongoose.model('UsersCollection', User); 