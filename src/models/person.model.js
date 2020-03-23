let mongoose = require('mongoose')


let personSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    birthDate: Date
})

module.exports = mongoose.model('person', personSchema, 'person');
