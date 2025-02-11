const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4
    },
    username: {
        type: String,
        required: [true, "username is required"],
        unique : true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique : true
    },
    password: {
        type: String,
        required: [true, "password is required"],
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
    refreshToken: {
        type : String
    }   
}, { timestamps: true });

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            id: this.id,
            email: this.email,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
};

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
};

const User = mongoose.model('User',userSchema);

module.exports = User;