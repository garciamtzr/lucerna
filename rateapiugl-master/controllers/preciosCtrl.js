const User = require('../models/user');
const Precio = require('../models/TB_HH_PRECIOS');



exports.getAllPrecios = async (req, res) => {
    const results = await Precio.find({});

    return res.status(200).json({result: results});
}


exports.getPrecio = async (req, res, next) =>{

    const results = await Precio.findOne(
    { 
            "PR_CLAVE" : Number(req.body.clave), 
            "PR_TIPO_PRECIO" : Number(req.body.tipoPrecio)
        
    })

    return res.status(200).json({result:results})

}