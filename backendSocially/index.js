const express = require('express')
const app = express()
const PORT = 5005
const cors = require('cors')

const corsOptions = {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Allow credentials
};
app.use(cors(corsOptions));

const connectMongoDb = require('./connection')

const UserRoute = require('./routes/user')
const RequestRoute = require('./routes/followRequests')
const PostRoute = require('./routes/posts')
const MessageRoute = require('./routes/message')

connectMongoDb('mongodb+srv://samiksha_z:Samiksha_123@samikshaz.o5yqf.mongodb.net/')
.then(() => console.log('Db connected successfully!!'))
.catch((e) => console.log(e))

app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use('/user',UserRoute)
app.use('/requests',RequestRoute)
app.use('/posts',PostRoute)
app.use('/message',MessageRoute)

app.listen(PORT,()=> console.log(`LISTENING TO PORT ${PORT}`))