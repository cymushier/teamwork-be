const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const gifRoutes = require('./routes/gif');

const app = express();

// Enable files upload
app.use(fileUpload({ createParentPath: true, useTempFiles : true, tempFileDir : '/tmp/uploads/' }));

/**
 * Setup CORS headers
 */
app.use(cors());

/**
 * Parse request data
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Log pipeline
 */
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/gifs', gifRoutes);

module.exports = app;
