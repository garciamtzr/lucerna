const mongoose = require('mongoose');

const clientesSchema = mongoose.Schema({
    CL_CLIENTE: {type: Number},
    CL_NOMNEGOCIO: {type: String, default: ''},
    CL_PUNTOVENTA: {type: String, default: ''},
    CL_RFC: {type: String, default: ''},
    CL_DIRNEGOCIO: {type: String, default: ''},
    CL_COLNEGOCIO: {type: String, default: ''},
    CL_CPCLIE: {type: Number, default: ''},
    CL_CIUDADNEGOCIO: {type: String, default: ''},
    CL_CORPORACION: {type: String, default: ''},
    CL_RUTA: {type: String, default: ''},
    CL_LUNES: {type: String, default: ''},
    CL_MARTES: {type: String, default: ''},
    CL_MIERCOLES: {type: String, default: ''},
    CL_JUEVES: {type: String, default: ''},
    CL_VIERNES: {type: String, default: ''},
    CL_SABADO: {type: String, default: ''},
    CL_DOMINGO: {type: String, default: ''},
    CL_BAJA: {type: String, default: ''},
    CL_SUCURSAL: {type: String, default: ''},
    CL_EMPRESA: {type: String, default: ''},
    admin: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    imageId: {type:String, default: ''},
    imageVersion: {type:String, default: ''}
});

module.exports = mongoose.model('Cliente', clientesSchema);