const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');
const businessCtrl = require('../controllers/business.controller');

router.route('/editBusiness/:businessId/addLogo').put(businessCtrl.uploadLogo);
router.route('/search').get(userCtrl.searchByNameOrTag);
router.route('/business/interact/:id').post(businessCtrl.updateInteractivity);
router.route('/business/mostPopular').get(businessCtrl.getMostPopular);

module.exports = router;
