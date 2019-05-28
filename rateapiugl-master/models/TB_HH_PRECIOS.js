const mongoose = require('mongoose');

const preciosSchema = mongoose.Schema({
    PR_TIPO_PRECIO: {type: Number},
    PR_CLAVE: {type: Number},
    PR_PRECIO: {type: Number},
    PR_IVA: {type: Number},
    PR_IEPS: {type: Number},
    PR_SUCURSAL: {type: Number},
    PR_EMPRESA: {type: Number}
});

module.exports = mongoose.model('TB_HH_PRECIOS', preciosSchema);