const express = require('express');
const router = express.Router();

const profileCtrl=require('../controllers/profile.controller.js');

router
    .route('/profile/:userId')
    .get(profileCtrl.getOneUser); //get all info about a user with _id equals the param userId



module.exports = router;
