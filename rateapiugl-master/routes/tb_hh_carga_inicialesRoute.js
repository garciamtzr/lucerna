const express = require('express');
const router = express.Router();
const tb_hh_carga_inicialesCtrl = require('../controllers/tb_hh_carga_inicialesCtrl');



router.get('/cargasIniciales/all', tb_hh_carga_inicialesCtrl.getAllCarga_Inicial);



module.exports = router;