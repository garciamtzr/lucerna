const mongoose = require('mongoose');

const productoSchema = mongoose.Schema({
    RV_CLIENTE: {type: Number},
    RV_NOM_CLIENTE: {type: String, default: ''},
    RV_RUTA: {type: Number, default: ''},
    RV_FECHA_NOTA: {type: Date, default: ''},
    RV_NOTA_REVOLVENTE: {type: String, default: ''},
    RV_TOTAL_NOTA: {type: Number, default: ''},
    RV_IVA_NOTA: {type: Number, default: ''},
    RV_IEPS_NOTA: {type:Number, default: ''},
    RV_SUCURSAL: {type:Number, default: ''},
    RV_EMPRESA: {type:Number, default: ''}


});

module.exports = mongoose.model('TB_HH_REVOLVENTES', productoSchema);