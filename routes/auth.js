const express = require('express');
const router = express.Router();

const userController = require('../controllers/auth');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/is-admin');

router.post('/create-user', auth, isAdmin, userController.createUser);

module.exports = router;
