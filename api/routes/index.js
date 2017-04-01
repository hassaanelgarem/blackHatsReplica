const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');


router.route('/privacy').get(userCtrl.privacy);
router.route('/terms').get(userCtrl.terms);
router.route('/business/:businessId/addfavorite').get(userCtrl.addFavorite); 

module.exports = router;