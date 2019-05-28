const mongoose = require('mongoose');

const precioClienteSchema = mongoose.Schema({
    PRC_RUTA_CLIE: {type: Number},
    PRC_CLIENTE: {type: Number},
    PRC_CLAVE: {type: Number},
    PRC_NOM_CLAVE: {type: String},
    PRC_GRUPO: {type: Number},
    PRC_PRECIO_ESPECIAL: {type: Number},
    PRC_IVA: {type: Number},
    PRC_IEPS: {type: Number},
    PRC_CORPO: {type: Number},
    PRC_SUCURSAL: {type: Number},
    PRC_EMPRESA: {type: Number}


});

module.exports = mongoose.model('tb_hh_precio_cliente', precioClienteSchema);