const User = require('../models/user');
const notaVentas = require('../models/tb_hh_nota_venta');

exports.createNotaVenta = async (req, res) => {
    const newNotaVenta = new notaVentas();
    newNotaVenta.NV_NOTA = req.body.NV_NOTA;
    newNotaVenta.NV_CLIENTE = req.body.NV_CLIENTE;
    newNotaVenta.NV_RAZON_SOCIAL = req.body.NV_RAZON_SOCIAL;
    newNotaVenta.NV_NOMBRE_CLIENTE = req.body.NV_NOMBRE_CLIENTE;
    newNotaVenta.NV_FECHA = req.body.NV_FECHA;
    newNotaVenta.NV_RUTA = req.body.NV_RUTA;
    newNotaVenta.NV_TIPO_VENTA = req.body.NV_TIPO_VENTA;
    newNotaVenta.NV_SUBTOTAL = req.body.NV_SUBTOTAL;
    newNotaVenta.NV_IVA = req.body.NV_IVA;
    newNotaVenta.NV_IEPS = req.body.NV_IEPS;
    newNotaVenta.NV_RECONOCIMIENTO = req.body.NV_RECONOCIMIENTO;
    newNotaVenta.NV_TOTAL = req.body.NV_TOTAL;
    newNotaVenta.NV_CORPO_CLIENTE = req.body.NV_CORPO_CLIENTE;
    newNotaVenta.NV_ESTATUS_NOTA = req.body.NV_ESTATUS_NOTA;
    newNotaVenta.NV_KILOLITROS_VENDIDOS = req.body.NV_KILOLITROS_VENDIDOS;

    const notaVenta = await newNotaVenta.save();

    return res.status(200).json({message: 'Venta registrada'});
}

exports.getAllNotaVenta = async (req, res) => {
    const results = await notaVentas.find({});

    return res.status(200).json({result: results});
}