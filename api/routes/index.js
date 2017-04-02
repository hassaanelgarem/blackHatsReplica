const express = require('express');
var expressValidator = require('express-validator');
const router = express.Router();
const passport = require('passport');
const userCtrl = require('../controllers/user.controller');
const businessCtrl = require('../controllers/business.controller');

router.use(expressValidator());
router.use(passport.initialize());
router.use(passport.session());

router.route('/register').post(userCtrl.registerUser);
router.post('/login', userCtrl.passportAuthenticate, userCtrl.login);
router.route('/logout').get(userCtrl.logout);
router.route('/deleteAccount').post(userCtrl.deleteAccount);
router.route('/search').get(userCtrl.searchByNameOrTag);
router.route('/business/interact/:id').post(businessCtrl.updateInteractivity);
router.route('/business/mostPopular').get(businessCtrl.getMostPopular);
module.exports = router;