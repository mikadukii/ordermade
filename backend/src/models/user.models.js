const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String, 
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    //measurements
    bustSize: {
        type: Number,
    },
    waistSize: {
        type: Number,
    },  
    hipSize: {
        type: Number,
    },
    profilePicture: {
        type: String,
        default: 'default.jpg'
    },

});

module.exports = mongoose.model('User', userSchema);