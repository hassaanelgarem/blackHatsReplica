const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');
const businessCtrl = require('../controllers/business.controller');
const reviewCtrl = require('../controllers/review.controller');


router.route('/search').get(userCtrl.searchByNameOrTag);
router.route('/editBusiness/:businessId/addTags').put(businessCtrl.addTags);
router.route('/review/:businessId').get(reviewCtrl.getReviews);
router.route('/review/add').post(reviewCtrl.addReview);

module.exports = router;