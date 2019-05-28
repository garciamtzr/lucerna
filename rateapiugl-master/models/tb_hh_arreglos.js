const mongoose = require('mongoose');

const arreglosSchema = mongoose.Schema({
    AR_CLIENTE: {type: Number},
    AR_NOM_CLIENTE: {type: String},
    AR_RUTA: {type: Number},
    AR_SALDO_PENDIENTE: {type: Number},
    AR_COMPLETO: {type: String},
    AR_SUCURSAL: {type: Number}
});

module.exports = mongoose.model('TB_HH_ARREGLOS', arreglosSchema);