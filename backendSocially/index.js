const express = require('express')
const app = express()
// const PORT = 5005
const cors = require('cors')
// const { changeMessage } = require('./models/message')
const mongoose = require('mongoose')

const Thread = require('./models/message')
const { io, server } = require('./socket')



const corsOptions = {
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Allow credentials
};
app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Node.js API',
    version: '1.0.0',
    description: 'A simple API documentation using Swagger',
  },
  servers: [
    {
      url: 'http://localhost:5005',
    },
  ],
};

// Swagger options
const optionsOfSwagger = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Path to the API docs (adjust the path according to your project structure)
};


const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerDocument = require('./swagger/swagger-output.json')
const swaggerSpec = swaggerJsdoc(optionsOfSwagger)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

const connectMongoDb = require('./connection')

const UserRoute = require('./routes/user')
const RequestRoute = require('./routes/followRequests')
const PostRoute = require('./routes/posts')
const MessageRoute = require('./routes/message')

// connectMongoDb(`${process.env.MONGODB_URL}`)
//   .then(() => {
//     console.log('DB connected successfully!!'.toUpperCase())
//     // changeMessage()

//     // const changeinMsg = Thread.watch()

//     // changeinMsg.on('change', (change) => {
//     //   console.log('change happened in msgs----- ', change);
//     //   const udtField = change.updateDescription.updatedFields
//     //   console.log(udtField);

//     //   const updatedMsg = Object.values(udtField)[0];

//     //   io.emit('new-message', updatedMsg)
//     // })

//     // changeinMsg.on('error', (error) => {
//     //   console.log(error);
//     // })

//      server.listen(9000 , () => console.log(`SERVER PORT: 9000`))


//     io.on('new-message', (socket) => {
//       console.log('new-message socket--> ', socket);
//     })

//     process.on('SIGINT', () => {
//       console.log('closing the serverr....');
//       server.close(() => {
//         console.log('server closed');
//         process.exit(0)
//       })
//     })
//   })
//   .catch((e) => console.log('ERRRORRRRRR:::: ', e))


mongoose.connect(`${process.env.MONGODB_URL}`)
mongoose.connection.once('open', () => {
  console.log('connected and open');
  server.listen(9000, () => console.log('listening to 9000'))

  const changeStream = Thread.watch()

  changeStream.on('change', (change) => {
    const udtField = change?.updateDescription?.updatedFields
    const updatedMsg = Object.values(udtField)[2].message

    console.log('UPDATE IN DB: ',udtField);
    console.log('UPDATED MSG IS- ',updatedMsg);

    io.emit('message', updatedMsg)
  })

  process.on('SIGINT', () => {
    console.log('closing the serverr....');
    server.close(() => {
      console.log('server closed');
      process.exit(0)
    })
  })


})

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/user', UserRoute)
app.use('/requests', RequestRoute)
app.use('/posts', PostRoute)
app.use('/message', MessageRoute)

app.listen(process.env.PORT, () => console.log(`LISTENING TO PORT ${process.env.PORT}`))


