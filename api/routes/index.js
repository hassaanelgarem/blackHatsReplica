const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');


router.route('/business/:businessId/addfavorite').get(userCtrl.addFavorite); 

module.exports = router;