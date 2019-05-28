const express = require('express');
const router = express.Router();
const tb_hh_productoCtrl = require('../controllers/productosCtrl');



router.get('/productos/all', tb_hh_productoCtrl.getAllProductos);

router.post('/productos/create', tb_hh_productoCtrl.createProducto);


module.exports = router;