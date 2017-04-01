const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');
//const businessCtrl = require('../controllers/business.controller');


//router.route('/add').post(businessCtrl.add);
router.route('/privacy').get('userCtrl.privacy');
router.route('/terms').get('userCtrl.terms');
router.route('/business/:businessId/addfavorite').get('userCtrl.addFavorite'); 

module.exports = router;