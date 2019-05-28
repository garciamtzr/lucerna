const mongoose = require('mongoose');

const clientesSchema = mongoose.Schema({
    num_cliente: {type: String},
    nombre_negocio: {type: String, default: ''},
    razon_social: {type: String, default: ''},
    productos: [{
        PD_PRODUCTO: {type: String, default:''},
        PD_NOMBRE: {type: String, default:''}
    }]
});

module.exports = mongoose.model('Cliente', clientesSchema);