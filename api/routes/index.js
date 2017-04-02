const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');
const businessCtrl = require('../controllers/business.controller');
const bookingCtrl = require('../controllers/booking.controller');


router.route('/search').get(userCtrl.searchByNameOrTag);
router.route('/business/interact/:id').post(businessCtrl.updateInteractivity);
router.route('/business/mostPopular').get(businessCtrl.getMostPopular);
router.route('/activity/book').post(bookingCtrl.bookActivity);

router.route('/activity/add').post(bookingCtrl.addActivity);

module.exports = router;
