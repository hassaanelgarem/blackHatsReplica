const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user.controller');

router.post('/register', userCtrl.registerUser);
router.post('/login', userCtrl.login);
router.get('/logout', userCtrl.logout);

module.exports = router;