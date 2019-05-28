const mongoose = require('mongoose');

const detalleNotaSchema = mongoose.Schema({
DN_FECHA: {type: Date},
DN_NOTA: {type: String},
DN_CLAVE: {type: Number},
DN_DESCRIPCION: {type: String},
DN_CANTIDAD_PIEZAS: {type: Number},
DN_PRECIO: {type: Number},
DN_IVA: {type: Number},
DN_IEPS: {type: Number},
DN_IMPORTE: {type: Number}
    
});

module.exports = mongoose.model('tb_hh_detalle_nota', detalleNotaSchema);
