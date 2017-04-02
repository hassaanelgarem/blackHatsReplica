const express = require('express');
const router = express.Router();

const reviewCtrl = require('../controllers/review.controller');

router.route('/review/:reviewId').delete(reviewCtrl.deleteReview);

module.exports = router;
