const User = require('../models/user');
const asistencias = require('../models/tb_hh_asistencias');

exports.createAsistencias = async (req, res) => {
    const newAsistencia = new asistencias();
    newNotaVenta.NV_NOTA = req.body.NV_NOTA;
    newAsistencia.AS_RUTA = req.body.AS_RUTA;
    newAsistencia.AS_FECHA = req.body.AS_FECHA;
    newAsistencia.AS_NUMERO_VENDEDOR = req.body.AS_NUMERO_VENDEDOR;
    newAsistencia.AS_NOMBRE_VENDEDOR = req.body.AS_NOMBRE_VENDEDOR;
    newAsistencia.AS_NUMERO_AYUDANTE = req.body.AS_NUMERO_AYUDANTE;
    newAsistencia.AS_NOMBRE_AYUDANTE = req.body.AS_NOMBRE_AYUDANTE;
    newAsistencia.AS_NUMERO_AYUDANTE2 = req.body.AS_NUMERO_AYUDANTE2;
    newAsistencia.AS_NOMBRE_AYUDANTE2 = req.body.AS_NOMBRE_AYUDANTE2;

    const asistenciass = await newAsistencia.save();

    return res.status(200).json({message: 'Asistencia Registrada'});
}