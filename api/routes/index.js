const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');

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


router.route('/privacy').get('userCtrl.privacy');
//router.route('/terms').get('userCtrl.terms');

module.exports = router;