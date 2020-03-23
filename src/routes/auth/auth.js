const express = require('express');
const bCrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const randToken = require('rand-token')
const tokenList = {}
const router = express.Router();

//MODELS
const userModel = require('../../models/users.model');

//VALIDATORS
const { registerValidation, loginValidation } = require('./validation');

//REGISTRATION
router.post('/registration', async (req, res) => {

    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const emailExist = await userModel.findOne({email: req.body.email})
    if (emailExist) return res.status(400).send('Email already exists');


    //HASH PASSWORD
    const salt = await bCrypt.genSalt(10);
    const hashedPassword = await bCrypt.hash(req.body.password, salt)

    const user = new userModel({
        login: req.body.login,
        password: hashedPassword,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    });
    try {
        const result = await user.save();
        res.status(200).send(result);

    } catch (e) {
        res.status(500).send(e);
    }

});

//LOGIN
router.post('/login', async (req, res) => {
    console.log(req,'CALID PASS')
    console.log(req.body.email, 'tokenLIST-----!!!!');

    let refreshTokens = {};
    //Lets Validate the data before we a user
    const { error } = loginValidation(req.query);
    console.log(error)
    if (error) return res.status(400).send(error.details[0].message);

    //Checking if the email exists
    const user = await userModel.findOne({email: req.query.email})
    if (!user) return res.status(400).send('Email is not found');

    //Password is correct
    const validPassword = await bCrypt.compare(req.query.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid Password');

    //Create and assign TOKEN
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET, {expiresIn: process.env.TOKEN_LIFE});
    // const refreshToken = randToken.uid(256);
    const refreshToken = jwt.sign(req.body, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_LIFE});
    tokenList[refreshToken] = req.query.email
    res.json({token: token, refreshToken})
});

router.post('/token', (req, res) => {
    const postData = req.query;
    if (postData.refreshToken && (postData.refreshToken in tokenList) && tokenList[postData.refreshToken] === postData.email) {
        const user = {
            'email': postData.email,
            'login': postData.login,
        };
        const token = jwt.sign(user, process.env.TOKEN_SECRET, {expiresIn: process.env.TOKEN_LIFE});
        const response = {
            'token': token
        };
        tokenList[postData.refreshToken].token = token;
        res.status(200).json(response);
    } else {
        res.status(400).send('Invalid request')
    }
});

module.exports = router;
