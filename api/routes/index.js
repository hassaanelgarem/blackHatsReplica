const express = require('express');
const router = express.Router();

var userController = require('../controllers/user.controller');

router.post('/register', userController.registerUser);

module.exports = router;