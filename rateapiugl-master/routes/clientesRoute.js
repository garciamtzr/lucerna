const express = require('express');
const router = express.Router();
const ClienteCtrl = require('../controllers/clientesCtrl');



router.get('/clientes/all', ClienteCtrl.getAllClientes);

router.post('/cliente/create', ClienteCtrl.createCliente);

module.exports = router;