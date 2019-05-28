const mongoose = require('mongoose');

const asistenciaSchema = mongoose.Schema({
    AS_RUTA: {type: Number},
    AS_FECHA: {type:Date},
    AS_NUMERO_VENDEDOR: {type: Number},
    AS_NOMBRE_VENDEDOR: {type: String},
    AS_NUMERO_AYUDANTE: {type: Number},
    AS_NOMBRE_AYUDANTE: {type: String},
    AS_NUMERO_AYUDANTE2:{type: Number},
    AS_NOMBRE_AYUDANTE2:{type: String}
});

module.exports = mongoose.model('TB_HH_ASISTENCIAS', asistenciaSchema);