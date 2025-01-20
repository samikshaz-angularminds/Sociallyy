const swaggerAutogen = require('swagger-autogen')()
const doc = {
    info : {
        title : 'Socially',
        description: 'API Documentation by swagger-autogen'
    },
    host : 'localhost:5005',
    schemes : 'http',
    tags: [
        { name: 'User', description: 'Operations related to user' },
        { name: 'Posts', description: 'Operations related to posts' },
        { name: 'Messages', description: 'Operations related to messages' },
        { name: 'Follow Requests', description: 'Operations related to follow requests' }
    ]
}

const outputFile = '../swagger/swagger-output.json'

const routes = ['../routes/user.js','../routes/posts.js','../routes/message.js','../routes/followRequests.js']

swaggerAutogen(outputFile,routes,doc)