const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');


router.route('/business/:businessId/addfavorite').post(userCtrl.addFavorite); 

module.exports = router;