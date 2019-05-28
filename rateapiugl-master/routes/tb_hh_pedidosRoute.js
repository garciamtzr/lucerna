const express = require('express');
const router = express.Router();
const tb_hh_pedidosCtrl = require('../controllers/tb_hh_pedidosCtrl');



router.get('/pedidos/all', tb_hh_pedidosCtrl.getAllPedidos);



module.exports = router;