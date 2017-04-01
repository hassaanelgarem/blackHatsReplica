const express = require('express');
const router = express.Router();

const reviewCtrl = require('../controllers/review.controller');

router.route('/review').post('reviewCtrl.addReview');

module.exports = router;
