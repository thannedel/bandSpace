const express = require('express');
const router = express.Router();

//const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
//const methodOverride = require('method-override');
const { Mongoose } = require('mongoose');
const mongoose = require('mongoose');
const config = require('config');
const mongoURI = config.get('mongoURI');
const auth = require('../../middleware/auth');





//Init gfs
let gfs;
var conn = mongoose.createConnection(mongoURI,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
conn.once('open', () => {
    //Init Stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
})


// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

// @route POST /upload
// @desc  Uploads file to DB
router.post('/', auth , upload.single('file'), (req, res) => {
  res.json({ file: req.file });
  //res.redirect('/');
});






/* const ImgUpload = require('../../models/ImgUpload');
const User = require('../../models/User'); */

/* // @route    POST api/imgUploads
// @desc     upload imgs to DB
// @access   Private
//file is because in the form has to be name="file"
router.post('/imgUploads', upload.single('file'), (req, res) => {
    res.json({ file: req.file });
}); */

module.exports = router;