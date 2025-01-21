const mongoose = require('mongoose')
const http = require('http')
const socketIo = require('socket.io')

const server = http.createServer()
const inpOut = socketIo(server)

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

    inpOut.on('connection', (socket) => {

        console.log('SOCKET:: ',socket);
        

        changeStream.on('change', (change) => {
            console.log('CHANGE HAPPENED::: ', change);
            socket.emit('new-message',change.updateDescription.updatedFields)
    
        })
    
        changeStream.on('error', (error) => {
            console.log('ERRORRR: ', error);
        })
    })

}

server.listen(9009, ()=>console.log(`SERVER PORT: 9009`))

module.exports = { Thread, changeMessage }