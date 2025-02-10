const mongoose = require('mongoose')


const followRequestsSchema = new mongoose.Schema({
    fromUser : {
        type : String,
        required : true
    },
    toUser : {
        type : String,
        required : true
    },
    status : {
        type : String,
        enum : ['pending', 'accepted', 'rejected'],
        default : 'pending'
    },
    createdAt : {
        type : Date,
        default: Date.now()
    }
})


const FollowRequest = mongoose.model('FollowRequest', followRequestsSchema)

module.exports = FollowRequest