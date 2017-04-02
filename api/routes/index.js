const express = require('express');
const router = express.Router();
const businessCtrl = require("../controllers/business.controller.js");


	router
   .route('/editBusiness/:businessId')
   .get(businessCtrl.editBasicInfo)
   .post(businessCtrl.saveNewInfo);	





module.exports = router;