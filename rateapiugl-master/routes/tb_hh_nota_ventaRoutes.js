const express = require('express');
const router = express.Router();
const notaVentaCtrl = require('../controllers/tb_hh_nota_ventasCtrl');



router.get('/notaVenta/all', notaVentaCtrl.getAllNotaVenta);

router.post('/notaVenta/create', notaVentaCtrl.createNotaVenta);

module.exports = router;