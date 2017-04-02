const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');
const businessCtrl = require('../controllers/business.controller');
const reviewCtrl = require('../controllers/review.controller');
const activityCtrl = require('../controllers/activity.controller');

router.route('/activity/:activityId/addPhoto').post(activityCtrl.addPhoto);
router.route('/activity/:activityId/deletePhoto/:photoPath').delete(activityCtrl.deletePhoto);
router.route('/search').get(userCtrl.searchByNameOrTag);
router.route('/business/interact/:id').post(businessCtrl.updateInteractivity);
router.route('/business/mostPopular').get(businessCtrl.getMostPopular);
router.route('/review/:businessId').get(reviewCtrl.getReviews);
router.route('/review/add').post(reviewCtrl.addReview);

module.exports = router;
