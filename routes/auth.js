const express = require('express');
const router = express.Router();

const userController = require('../controllers/auth');
const authAdmin = require('../middleware/auth-admin');

router.post('/create-user', authAdmin, userController.createUser);

module.exports = router;
