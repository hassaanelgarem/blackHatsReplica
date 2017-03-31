const express = require('express');
const router = express.Router();

const reviewCtrl = require('../controllers/review.controller');

router.route('/review/:businessId').get('reviewCtrl.getReviews');

module.exports = router;
