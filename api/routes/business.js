var express = require("express");
var router = express.Router();
var businessCtrl = require("../controllers/business.controller.js");


	router
   .route("/editbusiness")
   .get(businessCtrl.EditBusinessBasicInfo)
   .post(businessCtrl.SaveNewInfo);	

module.exports = router;