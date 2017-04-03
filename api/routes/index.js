const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');
const businessCtrl = require('../controllers/business.controller');
const expressValidator = require('express-validator');
const passport = require('passport');

router.use(expressValidator());
router.use(passport.initialize());
router.use(passport.session());

router.route('/search').get(userCtrl.searchByNameOrTag);
router.route('/business/interact/:id').post(businessCtrl.updateInteractivity);
router.route('/business/mostPopular').get(businessCtrl.getMostPopular);
router.route('/business/apply').post(businessCtrl.addBusiness);
router.route('/business/unVerifiedBusinesses').get(businessCtrl.unVerifiedBusinesses);
router.route('/business/verify/:id').post(businessCtrl.verifyBusiness);
router.route('/business/login').post(businessCtrl.passportAuthenticate, businessCtrl.businessLogin);
router.route('/business/logout').post(businessCtrl.businessLogout);
router.route('/business/decline/:id').post(businessCtrl.declineBusiness);

module.exports = router;
