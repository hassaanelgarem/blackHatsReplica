const express = require('express');
const router = express.Router();

const reviewCtrl = require('../controllers/review.controller');

router.route('/review/:businessId').get(reviewCtrl.getReviews);
router.route('/review/add').post(reviewCtrl.addReview);


router.route('/add').post(reviewCtrl.addUser);
router.route('/addB').post(reviewCtrl.add);

//router.route('/review/:reviewId').delete(reviewCtrl.deleteReview);

module.exports = router;
