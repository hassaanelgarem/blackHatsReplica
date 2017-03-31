const express = require('express');
const router = express.Router();

var userCtrl = require('../controllers/user.controller');

router.post('/register', userCtrl.registerUser);

module.exports = router;