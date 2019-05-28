const express = require('express');
const router = express.Router();
const tb_hh_revolventesCtrl = require('../controllers/tb_hh_revolventesCtrl');



router.get('/revolventes/all', tb_hh_revolventesCtrl.getAllRevolventes);

module.exports = router;