const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');
const businessCtrl = require('../controllers/business.controller');
const profileCtrl = require('../controllers/profile.controller.js');

router.route('/search').get(userCtrl.searchByNameOrTag);
router.route('/business/interact/:id').post(businessCtrl.updateInteractivity);
router.route('/business/mostPopular').get(businessCtrl.getMostPopular);
router.route('/profile/:userId').get(profileCtrl.getOneUser).put(profileCtrl.updateOneUser);
router.route('/profile/:userId/uploadProfilePicture').put(profileCtrl.uploadProfilePicture);


module.exports = router;