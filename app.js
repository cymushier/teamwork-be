const express = require('express');
const bodyParser = require('body-parser');

require('dotenv').config(); // Config local .env

const app = express();

/**
 * Setup CORS headers
 */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

/**
 * Easily parse request data
 */
app.use(bodyParser.json());

module.exports = app;
