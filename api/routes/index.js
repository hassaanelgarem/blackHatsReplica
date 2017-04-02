const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');
const businessCtrl = require('../controllers/business.controller');
const profileCtrl=require('../controllers/profile.controller.js');

<<<<<<< HEAD
router.route('/profile/:userId').get(profileCtrl.getOneUser);

=======
>>>>>>> 4b8ff048a75293d99ea97d86c0deb7cbc9a1ecd1

router.route('/search').get(userCtrl.searchByNameOrTag);
router.route('/business/interact/:id').post(businessCtrl.updateInteractivity);
router.route('/business/mostPopular').get(businessCtrl.getMostPopular);
router.route('/profile/:userId').get(profileCtrl.getOneUser);

module.exports = router;
