const express = require('express');
const router = express.Router();
const businessCtrl = require('../controllers/business.controller');


//router.route('/add').post(businessCtrl.add);



router.route('/business/interact/:id').post(businessCtrl.updateInteractivity);
router.route('/business/mostPopular').get(businessCtrl.getMostPopular);

module.exports = router;
