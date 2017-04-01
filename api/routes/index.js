const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');

router.route('/search').get(userCtrl.searchByNameOrTag);

module.exports = router;