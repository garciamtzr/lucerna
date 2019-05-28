const mongoose = require('mongoose');

const empleadoSchema = mongoose.Schema({
    EM_NUMERO: {type: Number},
    EM_NOMBRE: {type: String},
    EM_SUCURSAL: {type: Number},
    EM_EMPRESA: {type: Number},
});

module.exports = mongoose.model('TB_HH_USUARIOS', empleadoSchema);