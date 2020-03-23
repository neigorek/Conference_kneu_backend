let mongoose = require('mongoose')


let userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        min: 6
    },
    login: {
        type: String,
        required: true,
        min: 6
    },
    password: {
        type: String,
        required: true,
        min: 6
    }
})

module.exports = mongoose.model('user', userSchema, 'users');
