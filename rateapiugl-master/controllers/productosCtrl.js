const User = require('../models/user');
const Producto = require('../models/TB_HH_PRODUCTOS');




exports.createProducto = async (req, res) => {
    

    const newProducto = new Producto();
    newProducto.PD_CLAVE = req.body.PD_CLAVE;
    newProducto.PD_NOMBRE = req.body.PD_NOMBRE;
    newProducto.PD_UM = req.body.PD_UM;
    newProducto.PD_GRUPO = req.body.PD_GRUPO;
    newProducto.PD_CANTXCAJA = req.body.PD_CANTXCAJA;
    newProducto.PD_BAJA = req.body.PD_BAJA;
    newProducto.PD_SUCURSAL = req.body.PD_SUCURSAL;
    newProducto.PD_EMPRESA = req.body.PD_EMPRESA

    const product = await newProducto.save();

    return res.status(200).json({message: 'Product created Successfully'});
}



exports.getAllProductos = async (req, res) => {
    const results = await Producto.find({});

    return res.status(200).json({result: results});
}