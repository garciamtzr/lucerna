const User = require('../models/user');
const notaDetalleVentas = require('../models/tb_hh_detalle_nota');

exports.createNotaDetalleVenta = async (req, res) => {
    const newDetalleNota = new notaVentas();
    newDetalleNota.DN_FECHA = req.body.DN_FECHA;
    newDetalleNota.DN_NOTA = req.body.DN_NOTA;
    newDetalleNota.DN_CLAVE = req.body.DN_CLAVE;
    newDetalleNota.DN_DESCRIPCION = req.body.DN_DESCRIPCION;
    newDetalleNota.DN_CANTIDAD_PIEZAS = req.body.DN_CANTIDAD_PIEZAS;
    newDetalleNota.DN_PRECIO = req.body.DN_PRECIO;
    newDetalleNota.DN_IVA = req.body.DN_IVA;
    newDetalleNota.DN_IEPS = req.body.DN_IEPS;
    newDetalleNota.DN_IMPORTE = req.body.DN_IMPORTE;




    const detalleNota = await newDetalleNota.save();

    return res.status(200).json({message: 'registrado'});
}

exports.getAllNotaDetalleVenta = async (req, res) => {
    const results = await notaDetalleVentas.find({});

    return res.status(200).json({result: results});
}