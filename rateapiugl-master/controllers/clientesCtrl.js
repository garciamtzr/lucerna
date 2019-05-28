const User = require('../models/user');
const Cliente = require('../models/clientes');

exports.createCliente = async (req, res) => {
    if(req.body.CL_CLIENTE === undefined || req.body.CL_NOMNEGOCIO === undefined || req.body.CL_PUNTOVENTA === undefined
        || req.body.CL_CORPORACION === undefined || req.body.CL_COLNEGOCIO === undefined || req.body.CL_DIRNEGOCIO === undefined){
        return res.status(200).json({error: 'Empty fields are not allowed'});
    }
  
    if(req.body.CL_CLIENTE === undefined || req.body.CL_NOMNEGOCIO === undefined || req.body.CL_PUNTOVENTA === undefined
        || req.body.CL_CORPORACION === undefined || req.body.CL_COLNEGOCIO === undefined || req.body.CL_DIRNEGOCIO === undefined){
        return res.status(200).json({error: 'Empty fields are not allowed'});
    }

    const newCliente = new Cliente();
    newCliente.CL_CLIENTE = req.body.CL_CLIENTE;
    newCliente.CL_NOMNEGOCIO = req.body.CL_NOMNEGOCIO;
    newCliente.CL_PUNTOVENTA = req.body.CL_PUNTOVENTA;
    newCliente.CL_RFC = req.body.CL_RFC;
    newCliente.CL_DIRNEGOCIO = req.body.CL_DIRNEGOCIO;
    newCliente.CL_COLNEGOCIO = req.body.CL_COLNEGOCIO;
    newCliente.CL_CPCLIE = req.body.CL_CPCLIE;
    newCliente.CL_CIUDADNEGOCIO = req.body.CL_CIUDADNEGOCIO;
    newCliente.CL_CORPORACION = req.body.CL_CORPORACION;
    newCliente.CL_RUTA = req.body.CL_RUTA;
    newCliente.CL_LUNES = req.body.CL_LUNES;
    newCliente.CL_MARTES = req.body.CL_MARTES;
    newCliente.CL_MIERCOLES = req.body.CL_MIERCOLES;
    newCliente.CL_JUEVES = req.body.CL_JUEVES;
    newCliente.CL_VIERNES = req.body.CL_VIERNES;
    newCliente.CL_SABADO = req.body.CL_SABADO;
    newCliente.CL_DOMINGO = req.body.CL_DOMINGO;
    newCliente.CL_BAJA = req.body.CL_BAJA;
    newCliente.CL_SUCURSAL = req.body.CL_SUCURSAL;
    newCliente.CL_EMPRESA = req.body.CL_EMPRESA;
    newCliente.admin = req.body.userId;

    const cliente = await newCliente.save();

    return res.status(200).json({message: 'Company created Successfully'});
}





exports.getAllClientes = async (req, res) => {
    const results = await Cliente.find({});

    return res.status(200).json({result: results});
}