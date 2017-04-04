const express = require('express');
const router = express.Router();
const advCtrl = require('../controllers/advertisement.controller');


router.route('/advertisement/addAdvSlots').post(advCtrl.addAdvSlots);
router.route('/advertisement/getAdvSlots').get(advCtrl.getAdvSlots);
router.route('/advertisement/bookAdvSlot/:businessId/:advSlot').post(advCtrl.bookAdvSlot);
router.route('/advertisement/getCurrentBookings/:advSlotID').get(advCtrl.getCurrentBookings);
router.route('/advertisement/getFreeSlot/:advSlotID').get(advCtrl.getFreeSlot);
module.exports = router;
