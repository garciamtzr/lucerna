const mongoose = require('mongoose');

const rutaSchema = mongoose.Schema({
    RT_RUTA: {type: Number},
    RT_NOMBRE: {type: String},
    RT_TIPOPRECIO: {type: Number},
    RT_IDENTIFICADOR_EQUIPO: {type: Number},
    RT_SUCURSAL: {type: Number},
    RT_EMPRESA: {type: Number}
});

module.exports = mongoose.model('TB_HH_RUTAS', rutaSchema);