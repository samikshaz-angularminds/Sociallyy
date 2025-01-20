const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

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
const options = {
  swaggerDefinition,
  apis: ['../routes/*.js'], // Path to the API docs (adjust the path according to your project structure)
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Example API route
app.get('/api/hello', (req, res) => {
  res.send({ message: 'Hello World' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
