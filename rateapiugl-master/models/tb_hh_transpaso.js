const mongoose = require('mongoose');

const traspasoSchema = mongoose.Schema({
    TR_FECHA:{type: Date},
    TR_NUMERO: {type: Number},
    TR_RUTA:{type: Number},
    TR_CLAVE:{type: Number},
    TR_DESCRIPCION:{type:String},
    TR_CONVERSION_PZ: {type:Number},
    TR_ESTATUS:{type: String}
});

module.exports = mongoose.model('tb_hh_traspasos', pedidoSchema);