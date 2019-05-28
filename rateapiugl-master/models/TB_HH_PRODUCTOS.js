const mongoose = require('mongoose');

const productoSchema = mongoose.Schema({
    PD_CLAVE: {type: Number},
    PD_NOMBRE: {type: String, default: ''},
    PD_UM: {type: String, default: ''},
    PD_GRUPO: {type: Number, default: ''},
    PD_CANTXCAJA: {type: Number, default: ''},
    PD_BAJA: {type: String, default: ''},
    PD_SUCURSAL: {type: Number, default: ''},
    PD_EMPRESA: {type:Number, default: ''},
    UM_CANTIDAD: {type: Number, default: ''}
});

module.exports = mongoose.model('TB_HH_PRODUCTO', productoSchema);