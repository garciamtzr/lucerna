const User = require('../models/user');
const Promo = require('../models/tb_hh_promos');



exports.getAllPromos = async (req, res) => {
    const results = await Promo.find({});

    return res.status(200).json({result: results});
}
