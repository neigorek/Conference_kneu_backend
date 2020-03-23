const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const PersonModel = require('../models/person.model');

const verify = require('./auth/verifyToken')


router.get('/person', verify , async (req, res) => {
    try {
        let result = await PersonModel.find();
        res.status(200).send(result)
    } catch (e) {
        res.status(500).send(e);
    }

})

router.get('/person/:id', verify , async (req, res) => {
    try {
        let result = await PersonModel.findById(req.params.id).exec();
        res.status(200).send(result)
    } catch (e) {
        res.status(500).send(e);
    }

});

router.post('/person', verify , async (req, res) => {
    try {
        let person = new PersonModel(req.body);
        let result = await person.save();
        res.status(200).send(result);

    } catch (e) {
        res.status(500).send(e);
        
    }
});

router.put('/person/:id', verify , async (req, res) => {
    try {
        let person =  await PersonModel.findById(req.params.id).exec();
        person.set(req.body);
        let result = await person.save();
        res.status(200).send(result);
    } catch (e) {
        res.status(500).send(e);

    }
});

router.delete('/person/:id', verify , async (req, res) => {
    try {
        var result = await PersonModel.deleteOne({_id: req.params.id}).exec();
        res.send(result);
    } catch (e) {
        res.status(500).send(e);

    }
});

router.get('/error', verify , (req, res) => {
    throw new Error('This is forced error')
});

module.exports = router;
