const express = require('express');
const router = express.Router();
const tb_hh_pedidosCtrl = require('../controllers/tb_hh_traspasoCtrl');



router.get('/traspasos/all', tb_hh_traspasoCtrl.getTraspaso);



module.exports = router;