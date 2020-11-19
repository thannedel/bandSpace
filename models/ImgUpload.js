const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImgUploadSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    photo: {
        type: String,
        required: true
    },
    
});

module.exports = imgUpload = mongoose.model('imgUpload', ImgUploadSchema);