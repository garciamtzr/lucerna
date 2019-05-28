const express = require('express');
const router = express.Router();
const tb_hh_rutaCtrl = require('../controllers/rutaCtrl');



router.get('/rutas/all', tb_hh_rutaCtrl.getAllRutas);

module.exports = router;