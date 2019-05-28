const express = require('express');
const router = express.Router();
const tb_hh_usuariosCtrl = require('../controllers/tb_hh_usuarioCtrl');



router.get('/vendedores/all', tb_hh_usuariosCtrl.getAllVendedores);

module.exports = router;