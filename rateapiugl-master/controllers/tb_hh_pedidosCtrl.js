const User = require('../models/user');
const Pedidos = require('../models/tb_hh_pedidos');



exports.getAllPedidos = async (req, res) => {
    const results = await Pedidos.find({});

    return res.status(200).json({result: results});
}
