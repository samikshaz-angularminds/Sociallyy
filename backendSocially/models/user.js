const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4
    },
    username: {
        type: String,
        required: true,
        unique : true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    full_name: {
        type: String,
        required: true
    },
    profileImage: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'ProfilePhoto'
    },
    bio: {
        type: String,
        default : ''
    },
    phone: {
        type: String,
    },
    website: {
        type: String,
        default : ''
    },
    isVerified: {
        type : Boolean,
        default : false
    },            
    isPrivate: {
        type : Boolean,
        default : false
    },             
    followers: {
        type : [String],
        default : []
    },        
    followings: {
        type : [String],
        default : []
    },       
    posts: {
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'Post',
        default : []
    },            
}, { timestamps: true })

const User = mongoose.model('User',userSchema)

module.exports = User