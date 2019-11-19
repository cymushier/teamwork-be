const express = require('express');
const router = express.Router();

const gifController = require('../controllers/gif');
const cloudinary = require('../middleware/cloudinary-config');
const auth = require('../middleware/auth');
const authEmployee = require('../middleware/auth-employee');

router.post('/', auth, authEmployee, cloudinary, gifController.createGif);

module.exports = router;