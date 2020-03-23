const express = require('express');
const router = express.Router();

const verify = require('./auth/verifyToken')


const ConferenceModel = require('../models/conference.model');

//Create a new Conference
router.post('/conference', verify , (req, res) => {
    if (!req.body) {
        return res.status(400).send('Request body is missing')
    }

    let model = new ConferenceModel(req.body);
    model.save()
        .then(doc => {
            if (!doc) {
                return res.status(500)
            }
            res.status(201).send(doc)
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

router.get('/conference', verify , async (req, res) => {
    try {
        let result = await ConferenceModel.find();
        res.status(200).send(result)
    } catch (e) {
        res.status(500).send(e);
    }
})

module.exports = router;
