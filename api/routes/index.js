const express = require('express');
const router = express.Router();
const advCtrl = require('../controllers/advertisement.controller');

/*
require controllers files

Example: 

const userCtrl = require('../controllers/user.controller');
*/



/*
define routes

Example:

router.route('/login').post('userCtrl.login');


*/

router.route('/ads').get(advCtrl.getAdvSlots);
router.route('/business/bookAdvSlot').post(advCtrl.bookAdvSlot);
module.exports = router;
