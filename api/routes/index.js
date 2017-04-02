const express = require('express');
const router = express.Router();
const profileCtrl = require('../controllers/profile.controller.js');
const bookingCtrl = require('../controllers/booking.controller');
const reviewCtrl = require('../controllers/review.controller');
const userCtrl = require('../controllers/user.controller');
const businessCtrl = require('../controllers/business.controller');

router.route('/editBusiness/:businessId/addCategory').put(businessCtrl.addCategory);


module.exports = router;

