const express = require('express');
const router = express.Router();
const businessCtrl = require('../controllers/business.controller');


//router.route('/add').post(businessCtrl.add);
router.route('/business/interact').post(businessCtrl.updateInteractivity);


module.exports = router;
