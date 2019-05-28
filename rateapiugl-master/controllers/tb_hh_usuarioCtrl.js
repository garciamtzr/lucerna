const User = require('../models/user');
const Usuarios = require('../models/tb_hh_usuarios');



exports.getAllVendedores = async (req, res) => {
    const results = await Usuarios.find({});

    return res.status(200).json({result: results});
}
