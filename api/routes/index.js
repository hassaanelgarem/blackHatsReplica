const express = require('express');
const router = express.Router();


const userCtrl = require('../controllers/user.controller');
const bookingCtrl = require('../controllers/booking.controller');
const reviewCtrl = require('../controllers/review.controller');
const activityCtrl = require('../controllers/activity.controller');
const businessCtrl = require('../controllers/business.controller');
const profileCtrl = require('../controllers/profile.controller.js');
const advCtrl = require('../controllers/advertisement.controller');
const adminCtrl = require('../controllers/admin.controller');


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.json({error : "unauthorized access"});
}


function isNotLoggedIn(req, res, next) {
    if (!req.isAuthenticated())
        return next();

    res.json({error : "unauthorized access"});
}

//Not logged in only routes
router.route('/user/login').post(isNotLoggedIn, userCtrl.passportAuthenticate);
router.route('/business/login').post(isNotLoggedIn, businessCtrl.passportAuthenticate);


//Available to all routes
router.route('/search').get(userCtrl.searchByNameOrTag, userCtrl.searchByLocationAndCategory);
router.route('/business/:businessId/getInfo').get(businessCtrl.getCurrentInfo);
router.route('/business/mostPopular').get(businessCtrl.getMostPopular);
router.route('/business/unVerifiedBusinesses').get(businessCtrl.unVerifiedBusinesses);
router.route('/business/apply').post(businessCtrl.addBusiness);
router.route('/user/register').post(userCtrl.registerUser);
router.route('/user/profile/:userId').get(profileCtrl.getOneUser);
router.route('/review/user/:userId').get(reviewCtrl.getUserReviews);
router.route('/review/averageRating/:businessId').get(reviewCtrl.getAverageRating);
router.route('/review/:businessId').get(reviewCtrl.getReviews);
router.route('/activity/:businessId').get(activityCtrl.getActivities);
router.route('/booking/history/:userId').get(bookingCtrl.getBookingHistory);
router.route('/activity/freeSlots').post(activityCtrl.getAvailableSlots);
router.route('/advertisement/addAdvSlots').post(advCtrl.addAdvSlots);
router.route('/advertisement/getAdvSlots').get(advCtrl.getAdvSlots);
router.route('/advertisement/getCurrentBookings/:advSlotID').get(advCtrl.getCurrentBookings);
router.route('/advertisement/getFreeSlot/:advSlotID').get(advCtrl.getFreeSlot);


//Available to logged in only routes

//Business routes
router.route('/business/:businessId/interact').put(businessCtrl.updateInteractivity);
router.route('/business/addTags').put(isLoggedIn, businessCtrl.addTags);
router.route('/business/addCategory').put(isLoggedIn, businessCtrl.addCategory);
router.route('/business/editInfo').put(isLoggedIn, businessCtrl.saveNewInfo);
router.route('/business/addPhoto').post(isLoggedIn, businessCtrl.addPhoto);
router.route('/business/deletePhoto/:photoPath').delete(isLoggedIn, businessCtrl.deletePhoto);
router.route('/business/addLogo').post(isLoggedIn, businessCtrl.uploadLogo);
router.route('/business/logout').get(isLoggedIn, businessCtrl.businessLogout);


//Admin routes
router.route('/admin/verify/:businessId').put(isLoggedIn, adminCtrl.verifyBusiness);
router.route('/admin/delete/:businessId').delete(isLoggedIn, adminCtrl.deleteBusiness);


//User routes
router.route('/user/logout').get(isLoggedIn, userCtrl.logout);
router.route('/user/profile/editInfo').put(isLoggedIn, profileCtrl.updateOneUser);
router.route('/user/profile/uploadProfilePicture').post(isLoggedIn, profileCtrl.uploadProfilePicture);
router.route('/user/deleteAccount').delete(isLoggedIn, userCtrl.deleteAccount);
router.route('/user/addfavorite/:businessId').put(isLoggedIn, userCtrl.addFavorite);


//Review routes
router.route('/review/:businessId/add').post(isLoggedIn, reviewCtrl.addReview);
router.route('/review/:reviewId/edit').put(isLoggedIn, reviewCtrl.editReview);
router.route('/review/:reviewId/delete').delete(isLoggedIn, reviewCtrl.deleteReview);


//Activity routes
router.route('/activity/add').post(isLoggedIn, activityCtrl.addActivity);
router.route('/activity/:activityId/addSlot').post(isLoggedIn, activityCtrl.addSlot);
router.route('/activity/:activityId/deleteSlot').delete(isLoggedIn, activityCtrl.deleteSlot);
router.route('/activity/:activityId/addPhoto').post(isLoggedIn, activityCtrl.addPhoto);
router.route('/activity/:activityId/deletePhoto/:photoPath').delete(isLoggedIn, activityCtrl.deletePhoto);
router.route('/activity/book').post(isLoggedIn, bookingCtrl.bookActivity);


//Advertisement routes
router.route('/advertisement/bookAdvSlot/:businessId/:advSlot').post(isLoggedIn, advCtrl.bookAdvSlot);


module.exports = router;
