const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const morgan = require('morgan')
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const { AudioProcessorRouter } = require('./audioProcessor/router');

const app = express();

app.use(morgan("tiny"));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Audio Processor API',
      version: '1.0.0',
      description: 'API for processing audio files',
    },
  },
  apis: ['./src/audioProcessor/router.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/', AudioProcessorRouter);

module.exports = { app };