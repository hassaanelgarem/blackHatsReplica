const express = require('express');
const router = express.Router();

const profileCtrl=require('../controllers/profile.controller.js');

router.route('/profile/:userId').get(profileCtrl.getOneUser);



module.exports = router;
