const express = require('express');
const router = express.Router();
const passport = require('passport');


const profileCtrl = require('../controllers/profile.controller.js');
const bookingCtrl = require('../controllers/booking.controller');
const reviewCtrl = require('../controllers/review.controller');
const userCtrl = require('../controllers/user.controller');
const businessCtrl = require('../controllers/business.controller');
const expressValidator = require('express-validator');


router.route('/business/:businessId/addPhoto').post(businessCtrl.addPhoto);
router.route('/business/:businessId/deletePhoto/:photoPath').delete(businessCtrl.deletePhoto);
router.route('/user/:userId/addfavorite/:businessId').post(userCtrl.addFavorite);
router.route('/search').get(userCtrl.searchByNameOrTag);
router.route('/business/interact/:id').post(businessCtrl.updateInteractivity);
router.route('/business/mostPopular').get(businessCtrl.getMostPopular);
router.route('/business/apply').post(businessCtrl.addBusiness);
router.route('/business/unVerifiedBusinesses').get(businessCtrl.unVerifiedBusinesses);
router.route('/business/verify/:id').put(businessCtrl.verifyBusiness);
router.route('/business/login').post(businessCtrl.passportAuthenticate, businessCtrl.businessLogin);
router.route('/business/logout').post(businessCtrl.businessLogout);
router.route('/business/decline/:id').delete(businessCtrl.declineBusiness);
router.route('/profile/:userId').get(profileCtrl.getOneUser);
router.route('/activity/book').post(bookingCtrl.bookActivity);
router.route('/review/user/:userID').get(reviewCtrl.getUserReviews);
router.route('/review/edit/:reviewID').post(reviewCtrl.editReview);
router.route('/review/:businessId').get(reviewCtrl.getReviews);
router.route('/review/add').post(reviewCtrl.addReview);
router.route('/review/:reviewId').delete(reviewCtrl.deleteReview);


module.exports = router;
