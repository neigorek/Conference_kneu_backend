const mailer = require('../middleware/nodemailer');
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

router.get('/conferences', async (req, res) => {
    try {
        let result = await ConferenceModel.find();
        res.status(200).send(result)
    } catch (e) {
        res.status(500).send(e);
    }
});

router.patch('/conference/:id', async (req, res) => {
    if (req.body && req.params.id) {
        let updateBody = req.body;
        let id = req.params.id;
        ConferenceModel.findOneAndUpdate({_id: id}, {$set: updateBody}, {new: true})
            .then(doc => {
                if (!doc) {
                    return res.status(500);
                }
                res.status(201).send(doc);
            });
    }
});

router.post('/conference/add/:id', async (req, res) => {
    if (req.body && req.params.id) {
        let updateBody = req.body;
        let id = req.params.id;
        ConferenceModel.findOneAndUpdate({_id: id}, {$push: { documents: updateBody}},  {new: true})
            .then(doc => {
                if (!doc) {
                    return res.status(500);
                }
                res.status(201).send(doc);
            })
    }
});

router.post('/conference/:id/comment/:docId', (req, res) => {

    if (req.params.docId && req.body) {
        ConferenceModel.findOneAndUpdate(
            {'documents._id': req.params.docId},
            {$push: {'documents.$.comments': req.body}},
            {new: true}
            ).then(doc => {
                if (!doc) {
                    return res.status(500);
                }
            const email = doc.documents.find(d => d._id == req.params.docId).email;
            if (email) {
                mailer.sendEmail(email)
            }
                res.status(201).send(doc);
            });
    }
});


//ANGULAR ROUTERS
router.get(['/landing', '/landing/conferences', '/landing/conferences/:id', '/landing/reg',
    '/landing/conferences/:id/tezis'], (req, res) => {
    res.sendfile('./public/index.html');
});


module.exports = router;
