const User = require('../models/user');
const revolvente = require('../models/tb_hh_revolventes');


exports.getAllRevolventes = async (req, res) => {
    const results = await revolvente.find({});

    return res.status(200).json({result: results});
}
