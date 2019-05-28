const mongoose = require('mongoose');

const notaVentaySchema = mongoose.Schema({
    NV_NOTA: {type: String},
    NV_CLIENTE: {type: Number},
    NV_RAZON_SOCIAL: {type: String},
    NV_NOMBRE_CLIENTE: {type: String},
    NV_FECHA: {type: Date},
    NV_RUTA:{type: Number},
    NV_TIPO_VENTA: {type: String},
    NV_SUBTOTAL:{type: Number},
    NV_IVA: {type: Number},
    NV_IEPS:{type: Number},
    NV_RECONOCIMIENTO: {type: Number},
    NV_TOTAL: {type: Number},
    NV_CORPO_CLIENTE: {type: Number},
    NV_ESTATUS_NOTA: {type: String},
    NV_KILOLITROS_VENDIDOS: {type: Number}
    
});

module.exports = mongoose.model('tb_hh_nota_ventas', notaVentaySchema);
