const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    receiver: {
        type: [String],
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    message: {
        type: String,
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
    participants: {
        type: [String],
        required: true
    },
    message: [messageSchema],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
})

const Thread = mongoose.model('Thread', threadSchema)

function changeMessage() {
    const changeStream = Thread.watch()

    changeStream.on('change', (change) => {
        console.log('CHANGE HAPPENED::: ', change);
        inpOut.emit('new-message', change.updateDescription.updatedFields)
    })

    changeStream.on('error', (error) => {
        console.log('ERRORRR: ', error);
    })

    inpOut.on('connection', (socket) => {

        console.log('SOCKET:: ', socket);

        socket.on('disconnect', () => {
            console.log('SOCKET DISCONNECTED: ', socket.id);

        })

    })

    inpOut.on('new-message', (socket) => {

        console.log('SOCKET:: ', socket);

        socket.on('disconnect', () => {
            console.log('SOCKET DISCONNECTED: ', socket.id);

        })

    })
}



module.exports = Thread 