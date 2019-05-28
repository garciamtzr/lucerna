const User = require('../models/user');
const Ruta = require('../models/tb_hh_ruta');



exports.getAllRutas = async (req, res) => {
    const results = await Ruta.find({});

    return res.status(200).json({result: results});
}
