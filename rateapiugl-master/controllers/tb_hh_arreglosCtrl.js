const User = require('../models/user');
const Arreglos = require('../models/tb_hh_arreglos');



exports.getAllArreglos = async (req, res) => {
    const results = await Arreglos.find({});

    return res.status(200).json({result: results});
}
