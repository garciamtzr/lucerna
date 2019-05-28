const express = require('express');
const router = express.Router();
const tb_hh_precioClienteCtrl = require('../controllers/precioClienteCtrl');



router.get('/precioCliente/all', tb_hh_precioClienteCtrl.getAllPrecioClientes);
//router.post('/precioCliente/consulta',tb_hh_precioCtrl.getPrecio);


module.exports = router;