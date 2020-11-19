const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const auth = require('../../middleware/auth');
//const { replaceOne } = require("../../models/ImgUpload");


const ImgUpload = require('../../models/ImgUpload');
const User = require('../../models/User');


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null,'./uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});


const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}; 

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter: fileFilter
});

// @route    POST api/imgUpload
// @desc     Upload image
// @access   Private
router.post("/",auth, upload.single('photo'), (req, res, next) => {
    
    
  const imgUpload = new ImgUpload({
    
      user: req.user.id,
    
    photo: req.file.path 
  });
  imgUpload
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Image Uploaded successfully",
        uploadedImage: {
            user: result.user,
            
            _id: result._id,
            request: {
                type: 'GET',
                url: "http://localhost:5000/imgUpload/" + result._id
            }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


//@route Get api/imgUpload/user/:user_id
//@desc Get images by user ID
//@access Public
router.get("/user/:user_id", (req, res, next) => {
  ImgUpload.find({user:req.params.user_id})
    .select("user _id photo")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        imgUpload: docs.map(doc => {
          return {
            user: doc.user,
            photo: doc.photo,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:5000/imgUpload/" + doc._id
            }
          };
        })
      };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


module.exports = router;