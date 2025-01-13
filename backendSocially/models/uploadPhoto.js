const mongoose = require('mongoose')

const profilePhotoSchema = new mongoose.Schema({
    public_id : {
        type : String,
        required : true,
        default : '12345'
    },
    url : {
        type : String,
        required : true,
    }
})

const ProfilePhoto = mongoose.model('ProfilePhoto',profilePhotoSchema)

module.exports = ProfilePhoto