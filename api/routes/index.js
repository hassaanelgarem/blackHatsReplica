const express = require('express');
var expressValidator = require('express-validator');
const router = express.Router();
const passport = require('passport');

const profileCtrl = require('../controllers/profile.controller.js');
const bookingCtrl = require('../controllers/booking.controller');
const reviewCtrl = require('../controllers/review.controller');
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
router.route('/profile/:userId').get(profileCtrl.getOneUser);
router.route('/activity/book').post(bookingCtrl.bookActivity);
router.route('/review/user/:userID').get(reviewCtrl.getUserReviews);
router.route('/review/edit/:reviewID').post(reviewCtrl.editReview);
router.route('/review/:businessId').get(reviewCtrl.getReviews);
router.route('/review/add').post(reviewCtrl.addReview);
router.route('/review/:reviewId').delete(reviewCtrl.deleteReview);

module.exports = router;

