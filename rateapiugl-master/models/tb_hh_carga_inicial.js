const mongoose = require('mongoose');

const cargaInicialSchema = mongoose.Schema({
    DM_FECHA_CARGA: {type: Date},
    DM_RUTA: {type: Number},
    DM_GRUPO: {type: Number},
    DM_CANTIDAD: {type: Number},
    DM_TIPO_MOV: {type: Number},
    DM_USUARIO_REGISTRO: {type: Number},
    DM_SUCURSAL: {type: Number},
    DM_EMPRESA: {type: Number}
});

module.exports = mongoose.model('TB_HH_CARGA_INICIALES', cargaInicialSchema);