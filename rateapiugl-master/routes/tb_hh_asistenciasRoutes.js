const express = require('express');
const router = express.Router();
const asistenciaCtrl = require('../controllers/tb_hh_asistenciasCtrl');



router.post('/registrarAsistencia/create', asistenciaCtrl.createAsistencias);

module.exports = router;