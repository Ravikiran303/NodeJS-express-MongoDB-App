const mongoose = require('mongoose');
var validator = require('validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');


const Schema = mongoose.Schema;

const User = new Schema({
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
        unique: true,
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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

User.methods.generateAuthToken = async function () {
    const user = this;
    var token = jwt.sign({ _id: user._id }, 'MyToken');
    user.tokens = user.tokens.concat({ token });
    return token;
}

User.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}

User.pre('save', async function (next) {
    const user = this;
    console.log("Just before saving..")
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next();
});
module.exports = mongoose.model('UsersCollection', User); 