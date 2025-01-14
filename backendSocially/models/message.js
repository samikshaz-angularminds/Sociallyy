const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        required : true
    },
    message: {
        type: [String],
        required: true
    },
    messageType: {
        type: String,
        enum: ['text', 'image', 'video', 'file']
    },
    sentAt: {
        type: Date,
        default: Date.now
    },
    readAt: {
        type: Date,
        default: null
    }
})

const threadSchema = new mongoose.Schema({
    participants : {
        type : [String],
        required : true
    },
    message : [messageSchema],
    lastUpdated : {
        type : Date,
        default : Date.now
    }
})

const Thread = mongoose.model('Thread', threadSchema)

module.exports = Thread