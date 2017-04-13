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
const passwordCtrl = require('../controllers/resetPassword.controller');
const supportCtrl = require('../controllers/support.controller');
const imagesCtrl = require("../controllers/images.controller");


module.exports = function(passportConfig) {
    var authenticateUser = passportConfig.passport.authenticate('local-user', {
        successRedirect: '/',
        failureRedirect: '/api/login',
        failureFlash: false
    });


    var authenticateBusiness = passportConfig.passport.authenticate('local-business', {
        successRedirect: '/',
        failureRedirect: '/api/login',
        failureFlash: false
    });


    //Not logged in only routes
    router.route('/user/login').post(passportConfig.isNotLoggedIn, authenticateUser);
    router.route('/user/register').post(passportConfig.isNotLoggedIn, userCtrl.registerUser);
    router.route('/business/login').post(passportConfig.isNotLoggedIn, authenticateBusiness);
    router.route('/user/verifyAccount/:token').get(passportConfig.isNotLoggedIn, userCtrl.checkVerificationToken);
    router.route('/user/verifyAccount/:userId').post(passportConfig.isNotLoggedIn, userCtrl.confirmVerification);
    router.route('/user/resendVerification').post(passportConfig.isNotLoggedIn, userCtrl.resendVerification);
    router.route('/resetPassword/:token').get(passportConfig.isNotLoggedIn, passwordCtrl.checkResetPasswordToken);
    router.route('/resetPassword/:id').put(passportConfig.isNotLoggedIn, passwordCtrl.resetPassword);
    router.route('/forgotPassword').post(passportConfig.isNotLoggedIn, passwordCtrl.forgotPassword);
    router.route('/contactSupport').post(passportConfig.isNotLoggedIn, supportCtrl.addRequest);


    //Available to all routes
    router.route('/search').get(userCtrl.searchByNameOrTag, userCtrl.searchByLocationAndCategory);
    router.route('/business/:businessId/interact').put(businessCtrl.updateInteractivity);
    router.route('/business/:businessId/getInfo').get(businessCtrl.getCurrentInfo);
    router.route('/business/mostPopular').get(businessCtrl.getMostPopular);
    router.route('/business/unVerifiedBusinesses').get(businessCtrl.unVerifiedBusinesses);
    router.route('/business/apply').post(businessCtrl.addBusiness);
    router.route('/user/profile/:userId').get(profileCtrl.getOneUser);
    router.route('/review/user/:userId').get(reviewCtrl.getUserReviews);
    router.route('/review/averageRating/:businessId').get(reviewCtrl.getAverageRating);
    router.route('/review/:businessId').get(reviewCtrl.getReviews);
    router.route('/activity/:businessId').get(activityCtrl.getActivities);
    router.route('/booking/history/:userId').get(bookingCtrl.getBookingHistory);
    router.route('/activity/freeSlots').post(activityCtrl.getAvailableSlots);
    router.route('/advertisement/addAdvSlots').post(advCtrl.addAdvSlots);
    router.route('/advertisement/getAdvSlots').get(advCtrl.getAdvSlots);
    router.route('/advertisement/getCurrentBookings/:advSlotId').get(advCtrl.getCurrentBookings);
    router.route('/advertisement/getFreeSlot/:advSlotId').get(advCtrl.getFreeSlot);
    router.route('/image/:imageType/:imageName').get(imagesCtrl.getImage);


    //Available to logged in only routes


    //Business routes
    router.route('/business/editInfo').put(passportConfig.isBusinessLoggedIn, businessCtrl.saveNewInfo);
    router.route('/business/changePassword').put(passportConfig.isBusinessLoggedIn, businessCtrl.changePassword);
    router.route('/business/addPhoto').post(passportConfig.isBusinessLoggedIn, businessCtrl.addPhoto);
    router.route('/business/deletePhoto/:photoPath').delete(passportConfig.isBusinessLoggedIn, businessCtrl.deletePhoto);
    router.route('/business/addLogo').post(passportConfig.isBusinessLoggedIn, businessCtrl.uploadLogo);
    router.route('/business/logout').get(passportConfig.isBusinessLoggedIn, passportConfig.logout);
    //Business activity routes
    router.route('/activity/add').post(passportConfig.isBusinessLoggedIn, activityCtrl.addActivity);
    router.route('/activity/:activityId/addSlot').post(passportConfig.isBusinessLoggedIn, activityCtrl.addSlot);
    router.route('/activity/:activityId/deleteSlot').delete(passportConfig.isBusinessLoggedIn, activityCtrl.deleteSlot);
    router.route('/activity/:activityId/addPhoto').post(passportConfig.isBusinessLoggedIn, activityCtrl.addPhoto);
    router.route('/activity/:activityId/deletePhoto/:photoPath').delete(passportConfig.isBusinessLoggedIn, activityCtrl.deletePhoto);
    router.route('/activity/:activityId/delete').delete(passportConfig.isBusinessLoggedIn, activityCtrl.deleteActivity);


    //Admin routes
    router.route('/admin/business/verify/:businessId').put(passportConfig.isAdminLoggedIn, adminCtrl.verifyBusiness);
    router.route('/admin/business/delete/:businessId').delete(passportConfig.isAdminLoggedIn, adminCtrl.deleteBusiness);
    router.route('/admin/business/recoverAccount/:businessId').put(passportConfig.isAdminLoggedIn, adminCtrl.recoverBusiness);
    router.route('/admin/makeAdmin/:userId').put(passportConfig.isAdminLoggedIn, adminCtrl.makeAdmin);
    router.route('/admin/removeAdmin/:userId').put(passportConfig.isAdminLoggedIn, adminCtrl.removeAdmin);
    router.route('/admin/user/delete/:userId').delete(passportConfig.isAdminLoggedIn, adminCtrl.deleteUser);
    router.route('/admin/support/user/recoverAccount/:requestId').put(passportConfig.isAdminLoggedIn, adminCtrl.recoverUser);
    router.route('/admin/support/business/recoverAccount/:requestId').put(passportConfig.isAdminLoggedIn, adminCtrl.recoverBusiness);
    router.route('/admin/support/deleteRequest/:requestId').delete(passportConfig.isAdminLoggedIn, adminCtrl.deleteSupportRequest);


    //User routes
    router.route('/user/logout').get(passportConfig.isUserLoggedIn, passportConfig.logout);
    router.route('/user/profile/editInfo').put(passportConfig.isUserLoggedIn, profileCtrl.updateOneUser);
    router.route('/user/changePassword').put(passportConfig.isUserLoggedIn, userCtrl.changePassword);
    router.route('/user/profile/uploadProfilePicture').post(passportConfig.isUserLoggedIn, profileCtrl.uploadProfilePicture);
    router.route('/user/deleteAccount').delete(passportConfig.isUserLoggedIn, userCtrl.deleteAccount);
    router.route('/user/addFavorite/:businessId').put(passportConfig.isUserLoggedIn, userCtrl.addFavorite);
    router.route('/user/deleteFavorite/:businessId').delete(passportConfig.isUserLoggedIn, userCtrl.deleteFavorite);
    router.route('/activity/book').post(passportConfig.isUserLoggedIn, bookingCtrl.bookActivity);
    router.route('/activity/deleteBooking/:bookingId').delete(passportConfig.isUserLoggedIn, bookingCtrl.deleteBooking);
    //User review routes
    router.route('/review/:businessId/add').post(passportConfig.isUserLoggedIn, reviewCtrl.addReview);
    router.route('/review/:reviewId/edit').put(passportConfig.isUserLoggedIn, reviewCtrl.editReview);
    router.route('/review/:reviewId/delete').delete(passportConfig.isUserLoggedIn, reviewCtrl.deleteReview);


    //Advertisement routes
    router.route('/advertisement/bookAdvSlot/:advSlotId').post(passportConfig.isBusinessLoggedIn, advCtrl.bookAdvSlot);


    return router;
};