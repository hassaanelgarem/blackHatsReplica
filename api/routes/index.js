const express = require('express');
const router = express.Router();
const profileCtrl = require('../controllers/profile.controller.js');
const bookingCtrl = require('../controllers/booking.controller');
const reviewCtrl = require('../controllers/review.controller');
const userCtrl = require('../controllers/user.controller');
const businessCtrl = require('../controllers/business.controller');
const activityCtrl = require('../controllers/activity.controller');


router.route('/search').get(userCtrl.searchByNameOrTag);
router.route('/business/interact/:id').post(businessCtrl.updateInteractivity);
router.route('/business/mostPopular').get(businessCtrl.getMostPopular);
router.route('/profile/:userId').get(profileCtrl.getOneUser);
router.route('/activity/book').post(bookingCtrl.bookActivity);
router.route('/review/user/:userID').get(reviewCtrl.getUserReviews);
router.route('/review/edit/:reviewID').post(reviewCtrl.editReview);
router.route('/review/:businessId').get(reviewCtrl.getReviews);
router.route('/review/add').post(reviewCtrl.addReview);
router.route('/review/:reviewId').delete(reviewCtrl.deleteReview);
router.route('/activity/edit/:activityId').put(activityCtrl.editActivity);


module.exports = router;