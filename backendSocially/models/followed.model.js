const mongoose = require('mongoose')

const followSchema = await mongoose.Schema({
    user : {
        type : String,
        required : true
    },
    followers : [
        {
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref : 'User'
        }
    ],
    following : [
        {
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref : 'User'
        }
    ]
})

const Follow = mongoose.model( 'Follow',followSchema)

module.exports = Follow