const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');
const businessCtrl = require('../controllers/business.controller');

router.route('/business/:businessId/addPhoto').post(businessCtrl.addPhoto);
router.route('/business/:businessId/deletePhoto/:photoPath').delete(businessCtrl.deletePhoto);

router.route('/search').get(userCtrl.searchByNameOrTag);
router.route('/business/interact/:id').post(businessCtrl.updateInteractivity);
router.route('/business/mostPopular').get(businessCtrl.getMostPopular);

module.exports = router;
    