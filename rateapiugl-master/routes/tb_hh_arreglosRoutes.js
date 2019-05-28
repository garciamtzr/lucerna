const express = require('express');
const router = express.Router();
const tb_hh_arreglosCtrl = require('../controllers/tb_hh_arreglosCtrl');



router.get('/arreglos/all', tb_hh_arreglosCtrl.getAllArreglos);



module.exports = router;