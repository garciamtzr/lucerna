const express = require('express');
const router = express.Router();
const tb_hh_precioCtrl = require('../controllers/preciosCtrl');



router.get('/precios/all', tb_hh_precioCtrl.getAllPrecios);
router.post('/precios/consulta',tb_hh_precioCtrl.getPrecio);


module.exports = router;