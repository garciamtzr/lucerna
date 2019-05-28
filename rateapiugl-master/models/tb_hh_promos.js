const mongoose = require('mongoose');

const promosSchema = mongoose.Schema({
    PM_CLAVE_PROMO: {type: Number},
    PM_CLAVE_PRODUCTO: {type: Number},
    PM_CANTIDAD: {type: Number},
    PM_PRECIOXUNIDAD_PROMO: {type: Number},
    PM_APLICAR_RUTAS: {type: String},
    PM_ESTATUS: {type: String},
    PM_EMPRESA: {type: Number}
});

module.exports = mongoose.model('TB_HH_PROMOS', promosSchema);