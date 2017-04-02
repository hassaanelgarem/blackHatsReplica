const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');
const businessCtrl = require('../controllers/business.controller');

router.route('/editBusiness/:businessId/addCategory').put(businessCtrl.addCategory);

module.exports = router;
