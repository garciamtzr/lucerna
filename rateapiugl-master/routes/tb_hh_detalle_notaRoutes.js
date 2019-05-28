const express = require('express');
const router = express.Router();
const notaDetalleCtrl = require('../controllers/tb_hh_detalle_notaCtrl');



router.get('/detalleNota/all', notaDetalleCtrl.getAllNotaDetalleVenta);

router.post('/detalleNota/create', notaDetalleCtrl.createNotaDetalleVenta);

module.exports = router;