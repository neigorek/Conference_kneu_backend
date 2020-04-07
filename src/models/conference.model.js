let mongoose = require('mongoose')


let conferenceSchema = new mongoose.Schema({
    name: String,
    title1: String,
    title2: String,
    title3: String,
    organizers: [],
    dataStart: String,
    dataEnd: String,
    description: String,
    workVectors: [],
    image: [],
    defaultDocument: String,
    documents: [
        {
            docName: String,
            fistName: String,
            lastName: String,
            thirdName: String,
            studyPlace: String,
            course: String,
            tel: String,
            email: String,
            fileName: String
        }
    ],
    organizationPeople: {
        golova: {name: String, posada: String},
        zamGolova: [{name: String, posada: String}],
        zastupnuk: [{name: String, posada: String}],
    },
    programPeople: {
        golova: {name: String, posada: String},
        zamGolova: [{name: String, posada: String}],
        chelenu: [{name: String, posada: String}],
    },
    fileName: [],
});

module.exports = mongoose.model('conference', conferenceSchema, 'conference');
