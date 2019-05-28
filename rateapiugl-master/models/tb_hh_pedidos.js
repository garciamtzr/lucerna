const mongoose = require('mongoose');

const pedidoSchema = mongoose.Schema({
    PE_FECHA:{type: Date},
    PE_NUMERO: {type: Number},
    PE_RUTA:{type: Number},
    PE_CLIENTE: {type: Number},
    PE_CLAVE:{type: Number},
    PE_DESCRIPCION:{type:String},
    PE_CONVERSION_PZ: {type:Number},
    PE_USUARIO_REG:{type: Number},
    PE_ESTATUS:{type: String}
});

module.exports = mongoose.model('tb_hh_pedidos', pedidoSchema);
