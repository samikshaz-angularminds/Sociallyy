const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const Thread = require('./models/message')
const { io, server } = require('./socket')
require('dotenv').config();

console.log('ENVVVVVVV ',`${process.env.PORT}`);


const corsOptions = {
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Allow credentials
};
app.use(cors(corsOptions));

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
      url: `http://localhost:${process.env.PORT}`,
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT", // Specifies that the token is a JWT
      },
    },
    security: []
  }
};

// Swagger options
const optionsOfSwagger = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Path to the API docs (adjust the path according to your project structure)
};


const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerSpec = swaggerJsdoc(optionsOfSwagger)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec,{explorer:true}))


const UserRoute = require('./routes/user')
const RequestRoute = require('./routes/followRequests')
const PostRoute = require('./routes/posts')
const MessageRoute = require('./routes/message')

mongoose.connect(`${process.env.MONGODB_URL}`)
mongoose.connection.once('open', () => {
  console.log('connected and open');
  server.listen(process.env.SERVER_PORT, () => console.log(`listening to ${process.env.SERVER_PORT}`))

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

app.use('/api/user', UserRoute)
app.use('/api/requests', RequestRoute)
app.use('/api/posts', PostRoute)
app.use('/api/message', MessageRoute)

app.listen(process.env.PORT, () => console.log(`LISTENING TO PORT ${process.env.PORT}`))


console.log('ENVVVVVVV22 ',`${process.env.PORT}`);
