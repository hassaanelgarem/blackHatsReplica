const express = require('express');
var expressValidator = require('express-validator');
const router = express.Router();
const passport = require('passport');

router.use(expressValidator());

router.use(passport.initialize());
router.use(passport.session());


const userCtrl = require('../controllers/user.controller');

router.route('/register').post(userCtrl.registerUser);
router.post('/login',userCtrl.passportAuthenticate, userCtrl.login);
router.route('/logout').get(userCtrl.logout);
router.route('/deleteAccount').post(userCtrl.deleteAccount);

module.exports = router;