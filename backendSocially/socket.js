const { Server } = require('socket.io');
const http = require('http');
const app = require('express')()
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true // Allow credentials
    }
})

io.on('connection', socket => {
    console.log('connectedddddddddd--- ', socket.id);
    socket.on('new-message', (message) => {
        console.log('message------ ', message);
        io.emit('message', message)

    })
});

module.exports = { io, server };