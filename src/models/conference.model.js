let mongoose = require('mongoose')


let conferenceSchema = new mongoose.Schema({
    title: String,
    address: String,
    // photo: [],
    // people: [],
    // files: []

})

module.exports = mongoose.model('conference', conferenceSchema, 'conference');
