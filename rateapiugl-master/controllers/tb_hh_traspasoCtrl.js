const User = require('../models/user');
const Pedidos = require('../models/tb_hh_traspaso');



exports.getTraspaso = async (req, res) => {
    const results = await Pedidos.find({});

    return res.status(200).json({result: results});
}
