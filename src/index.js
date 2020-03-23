const Express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv').config();

const app = Express();

const personRoute = require('./routes/person');
const conferenceRoute = require('./routes/conference');
const authRoute = require('./routes/auth/auth');
const postRoute = require('./routes/posts');
mongoose.connect(process.env.DB_CONNECT,
    { useUnifiedTopology: true, useNewUrlParser: true },
    () => { console.log('connected------------------------', process.env.DB_CONNECT)
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use((req, res, next) => {
    console.log(`${new Date().toString()} => ${req.originalUrl}`, req.body);
    next();
})

app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);
app.use(personRoute);
app.use(conferenceRoute);
app.use(Express.static('public'));


//handler not found
app.use((req, res, next) => {
    res.status(404).send('We think you are lost');
})

//handler for error 500
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.sendFile(path.join(__dirname, '../public/505.html'))
})

const PORT = process.env.PORT  || 3000;
app.listen(PORT, () => console.info(`server has run on PORT:${PORT}`));
