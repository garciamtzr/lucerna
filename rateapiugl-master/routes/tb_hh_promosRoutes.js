const express = require('express');
const router = express.Router();
const tb_hh_promosCtrl = require('../controllers/tb_hh_promosCtrl');



router.get('/promos/all', tb_hh_promosCtrl.getAllPromos);

module.exports = router;