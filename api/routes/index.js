const express = require('express');
const router = express.Router();
const businessCtrl = require('../controllers/business.controller');

//router.route('/add').post(businessCtrl.add);
router.route('/business/:businessId/addPhoto').post(businessCtrl.addPhoto);
router.route('/business/:businessId/deletePhoto/:photoPath').delete(businessCtrl.deletePhoto);

module.exports = router;