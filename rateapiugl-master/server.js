const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');
const passport = require('passport');
const helmet = require('helmet');
const compression = require('compression');

const app = express();

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB);


app.use(helmet());
app.use(compression());



require('./passport/passport-local.js');
app.use(cors());


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Credentials", "true");
    res.header("Access-Control-Allow-Methods", 'GET','POST','DELETE','PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

app.use(passport.initialize());
app.use(passport.session());


const user = require('./routes/userRoute.js');
const company = require('./routes/companyRoute.js');
const cliente = require('./routes/clientesRoute.js');
const producto = require('./routes/Tb_hh_ProductosRoute.js');
const precios = require('./routes/Tb_hh_PreciosRoute.js');
const precioCliente = require('./routes/Tb_hh_Precio_ClienteRoute.js');
const rutas = require('./routes/Tb_hh_rutaRoute.js');
const tb_hh_usuarios = require('./routes/tb_hh_usuariosRoute.js');
const tb_hh_revolventes = require('./routes/tb_hh_revolventesRoute.js');
const tb_hh_promos = require('./routes/tb_hh_promosRoutes.js');
const tb_hh_carga_iniciales = require('./routes/tb_hh_carga_inicialesRoute.js')
const tb_hh_arreglos = require('./routes/tb_hh_arreglosRoutes.js')
const tb_hh_nota_ventas = require('./routes/tb_hh_nota_ventaRoutes.js')
const tb_hh_detalle_notas = require('./routes/tb_hh_detalle_notaRoutes.js')
const tb_hh_asistencias = require('./routes/tb_hh_asistenciasRoutes.js')
const tb_hh_pedidos = require('./routes/tb_hh_pedidosRoute.js')
const tb_hh_traspasos = require('./routes/tb_hh_traspasoRoute.js')

app.use('/api', user);
app.use('/api', company);
app.use('/api', cliente);
app.use('/api', producto);
app.use('/api', precios);
app.use('/api', precioCliente);
app.use('/api', rutas);
app.use('/api', tb_hh_usuarios);
app.use('/api', tb_hh_revolventes);
app.use('/api', tb_hh_promos);
app.use('/api', tb_hh_carga_iniciales);
app.use('/api', tb_hh_arreglos);
app.use('/api', tb_hh_nota_ventas);
app.use('/api', tb_hh_detalle_notas);
app.use('/api', tb_hh_asistencias);
app.use('/api', tb_hh_pedidos);
app.use('/api', tb_hh_traspasos);

app.listen(process.env.PORT || 3000, () =>{
    console.log('server running in port 3000');
});

