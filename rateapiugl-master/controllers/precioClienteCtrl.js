const User = require('../models/user');
const PrecioCliente = require('../models/TB_HH_PRECIO_CLIENTE');



exports.getAllPrecioClientes = async (req, res) => {
const results = await PrecioCliente.find({});
//const results = await ('tb_hh_precio_cliente').find({});

return res.status(200).json({result: results});

   // const results = await PrecioCliente.find(
//{ 
      ///          "PRC_RUTA_CLIE" : req.params.PRC_RUTA_CLIE
            
      //  });
    
       //// return res.status(200).json({result:results});
        
        
}



