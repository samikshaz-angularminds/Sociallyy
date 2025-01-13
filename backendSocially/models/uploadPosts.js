const mongoose = require('mongoose')

const postsSchema = new mongoose.Schema({
    caption: {
        type: String,
    },
    media: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    accountHolderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    accountHolderName: {
        type: String,
        required: true
    },
    likes: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const Post = mongoose.model('Post', postsSchema)

module.exports = Post