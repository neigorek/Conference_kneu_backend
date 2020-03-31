const Express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv').config();
const cors = require('cors');
const crypto = require('crypto')
const Grid = require('gridfs-stream');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');

const app = Express();

const personRoute = require('./routes/person');
const conferenceRoute = require('./routes/conference');
const authRoute = require('./routes/auth/auth');
const postRoute = require('./routes/posts');
app.use(cors());

mongoose.connect(process.env.REMOTE_DB_CENNECT,
    { useUnifiedTopology: true, useNewUrlParser: true },
    () => { console.log('connected------------------------', process.env.REMOTE_DB_CENNECT)
});

const conn = mongoose.createConnection(process.env.REMOTE_DB_CENNECT,
    {useUnifiedTopology: true, useNewUrlParser: true })

let gfs;
conn.once('open', () => {
    // init stream
    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection('uploads');
});

// Storage
const storage = new GridFsStorage({
    url: process.env.REMOTE_DB_CENNECT,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString("hex") + 'file';
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({
    storage
});


app.post('/upload', upload.single("file"), (req, res) => {
    res.status(200).send(req.file);
});

app.get('/files', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
            res.render('index', { files: false });
        } else {
            files.map(file => {
                if (
                    file.contentType === 'image/jpeg' ||
                    file.contentType === 'image/png'
                ) {
                    file.isImage = true;
                } else {
                    file.isImage = false;
                }
            });
            res.status(200).send(files);
        }
    });
});

app.get('/files/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }
        // If File exists this will get executed
        const readstream = gfs.createReadStream(file.filename);
        return readstream.pipe(res);
    });
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
