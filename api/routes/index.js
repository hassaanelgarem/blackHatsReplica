const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');
const businessCtrl = require('../controllers/business.controller');
const activityCtrl = require('../controllers/activity.controller');



router.route('/search').get(userCtrl.searchByNameOrTag);
router.route('/business/interact/:id').post(businessCtrl.updateInteractivity);
router.route('/business/mostPopular').get(businessCtrl.getMostPopular);
router.route('/activity/edit/:activityId').post(activityCtrl.editActivity);
module.exports = router;
