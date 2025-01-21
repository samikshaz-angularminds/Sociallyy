const express = require('express')
const app = express()
// const PORT = 5005
const cors = require('cors')
const { changeMessage } = require('./models/message')

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
      url: 'http://localhost:5005',
    },
  ],
};

// Swagger options
const optionsOfSwagger = {
  swaggerDefinition,
  apis: ['../routes/*.js'], // Path to the API docs (adjust the path according to your project structure)
};


const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')
// const swaggerDocument = require('./swagger/swagger-output.json')
const swaggerSpec = swaggerJsdoc(optionsOfSwagger)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

const connectMongoDb = require('./connection')

const UserRoute = require('./routes/user')
const RequestRoute = require('./routes/followRequests')
const PostRoute = require('./routes/posts')
const MessageRoute = require('./routes/message')

connectMongoDb(`${process.env.MONGODB_URL}`)
  .then(() => {
    console.log('DB connected successfully!!'.toUpperCase())
    changeMessage()
  })
  .catch((e) => console.log('ERRRORRRRRR:::: ', e))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.use('/user', UserRoute)
app.use('/requests', RequestRoute)
app.use('/posts', PostRoute)
app.use('/message', MessageRoute)

app.listen(process.env.PORT, () => console.log(`LISTENING TO PORT ${process.env.PORT}`))