const express = require('express');
var expressValidator = require('express-validator');
const router = express.Router();
const passport = require('passport');


const userCtrl = require('../controllers/user.controller');
const bookingCtrl = require('../controllers/booking.controller');
const reviewCtrl = require('../controllers/review.controller');
const activityCtrl = require('../controllers/activity.controller');
const businessCtrl = require('../controllers/business.controller');
const profileCtrl = require('../controllers/profile.controller.js');


router.use(expressValidator());
router.use(passport.initialize());
router.use(passport.session());


router.route('/activity/edit/:activityId/addSlot').post(activityCtrl.addSlot);
router.route('/activity/:activityId/deleteSlot').delete(activityCtrl.deleteSlot);
router.route('/business/edit/:businessId').get(businessCtrl.getCurrentInfo).put(businessCtrl.saveNewInfo);
router.route('/register').post(userCtrl.registerUser);
router.route('/login').post(userCtrl.passportAuthenticate, userCtrl.login);
router.route('/logout').get(userCtrl.logout);
router.route('/deleteAccount').delete(userCtrl.deleteAccount);
router.route('/editBusiness/:businessId/addCategory').put(businessCtrl.addCategory);
router.route('/search').get(userCtrl.searchByNameOrTag, userCtrl.searchByLocationAndCategory);
router.route('/editBusiness/:businessId/addLogo').put(businessCtrl.uploadLogo);
router.route('/business/:businessId/addPhoto').post(businessCtrl.addPhoto);
router.route('/business/:businessId/deletePhoto/:photoPath').delete(businessCtrl.deletePhoto);
router.route('/user/:userId/addfavorite/:businessId').post(userCtrl.addFavorite);
router.route('/activity/:activityId/addPhoto').post(activityCtrl.addPhoto);
router.route('/activity/:activityId/deletePhoto/:photoPath').delete(activityCtrl.deletePhoto);
router.route('/search').get(userCtrl.searchByNameOrTag);
router.route('/editBusiness/:businessId/addTags').put(businessCtrl.addTags);
router.route('/business/interact/:id').post(businessCtrl.updateInteractivity);
router.route('/business/mostPopular').get(businessCtrl.getMostPopular);
router.route('/business/businessPage/:id').get(businessCtrl.getBusinessInfo);
router.route('/profile/:userId').get(profileCtrl.getOneUser).put(profileCtrl.updateOneUser);
router.route('/profile/:userId/uploadProfilePicture').put(profileCtrl.uploadProfilePicture);
router.route('/activity/book').post(bookingCtrl.bookActivity);
router.route('/activity/:businessId').get(activityCtrl.getActivities);
router.route('/review/user/:userID').get(reviewCtrl.getUserReviews);
router.route('/review/edit/:reviewID').post(reviewCtrl.editReview);
router.route('/review/:businessId').get(reviewCtrl.getReviews);
router.route('/review/add').post(reviewCtrl.addReview);
router.route('/review/averageRating/:businessId').get(reviewCtrl.getAverageRating);
router.route('/review/:reviewId').delete(reviewCtrl.deleteReview);
router.route('/booking/history/:userId').get(bookingCtrl.getBookingHistory);
router.route('/activity/freeSlots').post(activityCtrl.getAvailableSlots);


module.exports = router;
