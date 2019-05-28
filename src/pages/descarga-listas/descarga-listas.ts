import { PromosProvider } from './../../providers/promos/promos';
import { CargaInicialProvider } from './../../providers/carga-inicial/carga-inicial';
import { ArregloProvider } from './../../providers/arreglo/arreglo';
import { RevolventesProvider } from './../../providers/revolventes/revolventes';
import { TbHhUsuariosProvider } from './../../providers/tb-hh-usuarios/tb-hh-usuarios';
import { RutaProvider } from './../../providers/ruta/ruta';
import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController,LoadingController, ViewController, AlertController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ClienteProvider } from './../../providers/cliente/cliente';
import { ProductoProvider } from './../../providers/producto/producto';
import { PrecioProvider } from './../../providers/precio/precio';
import { PrecioClienteProvider } from './../../providers/precio-cliente/precio-cliente';
import { Storage } from '@ionic/storage';
import { Subscriber } from 'rxjs/Subscriber';
import { THIS_EXPR, STRING_TYPE } from '@angular/compiler/src/output/output_ast';
import { daysInMonth } from 'ionic-angular/umd/util/datetime-util';




declare var SqlServer: any;
@IonicPage()
@Component({
  selector: 'page-descarga-listas',
  templateUrl: 'descarga-listas.html',
})
export class DescargaListasPage {

  //variables

  loading: any;
  rutamail
  img: any = [];
  vacio: string;
  
  consulta:string;
  clientes = [];
  clientesSQL: any = [];

  productos: any;
  productosSQL: any = [];

  precios = [];
  preciosSQL: any = [];

  precioCliente = [];
  precioClienteSQL: any=[];

  ruta = [];
  rutaSQL: any=[];

  tb_hh_usuarios = [];

  tb_hh_revolventes = [];

  arreglos = [];

  cargasIniciales = [];

  promos = [];
  cero:string ="0"

  pedidos=[];
  pedidosSQL: any=[];

  fechaActual=new Date();
  folioIni='';
  prefolioIni='';
  dia = this.fechaActual.getDate();
  mes = this.fechaActual.getMonth()+1;
  anio = this.fechaActual.getFullYear();
  diaStr=this.dia.toString();
  mesStr=this.mes.toString();
  anioStr=this.anio.toString();

  rutaStr='';
  imgDefault: any

  objeto: any;

  asistencias:any;
  nombresVendedores: any=[];
  consulta2: string;
  db:SQLiteObject; // ADDED
  numReloj
  datos =[]
  

  //variable para fecha
  fechaActual2=new Date();
  fechaHoraFinal:string;
  //variables para mostrar el horario
   Hora = this.fechaActual2.getHours();
   Minutos = this.fechaActual2.getMinutes();
   Segundos = this.fechaActual2.getSeconds();
     //variables tipo string para mostrar el horario
  h='';
  m='';
  s='';
  horaFinal=''; //concatenado de todas las partes que conforman la hora

  queFUNCIONE
  quefuncionechinga

  


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public sqlite: SQLite,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private Storage: Storage
   ) {
//esto lo recibe de inicio -dia
      this.clientes = this.navParams.get('clientes');
      this.productos = this.navParams.get('productos');
      this.precios = this.navParams.get('precios');
      this.precioCliente = this.navParams.get('precioCliente');
      this.ruta = this.navParams.get('ruta')
      this.tb_hh_usuarios = this.navParams.get('tb_hh_usuarios');
      this.tb_hh_revolventes = this.navParams.get('tb_hh_revolventes');
      this.arreglos = this.navParams.get('arreglos');
      this.cargasIniciales = this.navParams.get('cargasIniciales');
      this.promos = this.navParams.get('promos');
      this.pedidos = this.navParams.get('pedidos'); 


      SqlServer.init("201.174.70.186", "SQLSERVER", "sa", "TuLucernita2017", "SistemaComercial", function(event) {
        // alert(JSON.stringify(event));
         
       }, function(error) {
         alert(JSON.stringify(error));
       });

       Storage.get('imagenes').then((val) => {
         this.img = val;
        //console.log('Your age is', val);
      });
      


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DescargaListasPage');
    //this.getData()
    this.getAsistencia();   


    
  }

  ionViewDidEnter(){
   //this.getJSON();

  
   
  }

  ionViewWillEnter(){
    this.obtenerRuta();
    this.cosadelStorage()
  }
 

  showLoading(){
    
    this.loading = this.loadingCtrl.create({
      content: 'Bajando Datos..',
      duration: 36000
    });

    this.loading.present();
  }

  obtenerRuta(){
    this.Storage.get('useremail').then((val) =>{
      this.rutamail = parseInt(val);
      console.log(this.rutamail)
    


        
    this.rutaStr=this.rutamail.toString(); //la manda a una variable string para formar el folio de la ruta
    this.Storage.get('asistencia').then((val) =>{
      this.Storage.set('vendedor',val[0])
      this.asistencias =val;

      
    })
    })

    
  }

  irpedidos(){
    this.navCtrl.setRoot("PedidosPage")
  }

  async doSQL(){
    try{
  await this.getData();
  
  this.getusuarios();
  //await this.showLoading();
  await this.navCtrl.setRoot("HomePage", {email: this.rutamail});

    }catch(error){
      if(error){
        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: error,
          buttons: ['Ok']
        });
        alert.present();
      }
    }
  }

  getAsistencia(){
    //return new Promise(function(resolve, reject)
     this.sqlite.create({
       name: 'ionicdb.db',
       location: 'default'
     }).then((db: SQLiteObject) => {
       this.db = db;
       
      db.executeSql('CREATE TABLE IF NOT EXISTS tb_hh_asistencia(AS_RUTA INT,AS_FECHA DATE, AS_NUMERO_VENDEDOR INT, AS_NOMBRE_VENDEDOR TEXT, AS_NUMERO_AYUDANTE INT, AS_NOMBRE_AYUDANTE TEXT, AS_NUMERO_AYUDANTE2 INT, AS_NOMBRE_AYUDANTE2 TEXT )', [])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));
      db.executeSql('CREATE TABLE IF NOT EXISTS tb_hh_usuarios(EM_NUMERO INT, EM_NOMBRE TEXT, EM_SUCURSAL INT, EM_EMPRESA INT)', [])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));
      
      for(var i = 0; i<this.tb_hh_usuarios.length; i++){
        console.log("primer parte jala chida")
  
        var EM_NUMERO = this.tb_hh_usuarios[i].EM_NUMERO;
        var EM_NOMBRE = this.tb_hh_usuarios[i].EM_NOMBRE;
        var EM_SUCURSAL = this.tb_hh_usuarios[i].EM_SUCURSAL;
        var EM_EMPRESA = this.tb_hh_usuarios[i].EM_EMPRESA;
        var query6 = "INSERT INTO tb_hh_usuarios(EM_NUMERO, EM_NOMBRE, EM_SUCURSAL, EM_EMPRESA) VALUES (?,?,?,?)"
     db.executeSql(query6, [EM_NUMERO, EM_NOMBRE, EM_SUCURSAL, EM_EMPRESA]).then(function(res) {
        }, function (err) {
          console.error(err);
          //this.presentToast(err)
        });
      }

   })
   
   }

   cosadelStorage(){
    return this.Storage.set('folioOG', this.cero)
   }

   getusuarios(){
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      
      
      console.log(this.asistencias[0])
      var sql = `SELECT EM_NUMERO, EM_NOMBRE FROM tb_hh_usuarios WHERE EM_NUMERO =?`
      this.horaFinal=this.Hora+":"+this.Minutos+":"+this.Segundos
      this.fechaHoraFinal= this.fechaActual.toLocaleDateString('en-GB')+" "+this.horaFinal;
      console.log(this.horaFinal, "hora fecha final")
       return this.db.executeSql(sql,[this.asistencias[0]])
      
      })
     .then(res =>{
       if(this.asistencias[1] != '9999'){
        console.log(res.rows.item(0).EM_NOMBRE)
        this.nombresVendedores[0] ={EM_NOMBRE: res.rows.item(0).EM_NOMBRE,EM_NUMERO:res.rows.item(0).EM_NUMERO} 
        var sql = `SELECT EM_NUMERO, EM_NOMBRE FROM tb_hh_usuarios WHERE EM_NUMERO =?`
         return this.db.executeSql(sql,[this.asistencias[1]])
       }else{
        console.log(res.rows.item(0).EM_NOMBRE)
        this.nombresVendedores[0] ={EM_NOMBRE: res.rows.item(0).EM_NOMBRE,EM_NUMERO:res.rows.item(0).EM_NUMERO} 
         return this.nombresVendedores[1]={EM_NOMBRE: 'Union de Ganaderos',EM_NUMERO:'9999'}
       }
       
       
     }).then(res1 =>{
       if(this.asistencias[2] != '9999'){
        console.log(res1.rows.item(0).EM_NOMBRE)
      this.nombresVendedores[1]={EM_NOMBRE: res1.rows.item(0).EM_NOMBRE,EM_NUMERO:res1.rows.item(0).EM_NUMERO}
      var sql = `SELECT EM_NUMERO, EM_NOMBRE FROM tb_hh_usuarios WHERE EM_NUMERO =?`
       return this.db.executeSql(sql,[this.asistencias[2]])
       }else{
        console.log(this.nombresVendedores)
        //this.nombresVendedores[1]={EM_NOMBRE: res1.rows.item(0).EM_NOMBRE,EM_NUMERO:res1.rows.item(0).EM_NUMERO}
        return this.nombresVendedores[1]={EM_NOMBRE: 'Union de Ganaderos',EM_NUMERO:'9999'}
        
       }
      
     }).then(res2 =>{
       if(this.asistencias[2] != '9999'){
      this.nombresVendedores[2]={EM_NOMBRE: res2.rows.item(0).EM_NOMBRE,EM_NUMERO:res2.rows.item(0).EM_NUMERO}
      console.log(this.nombresVendedores)
      this.consulta2 = `INSERT  INTO tb_hh_asistencia  (AS_RUTA,AS_FECHA, AS_NUMERO_VENDEDOR, AS_NOMBRE_VENDEDOR, AS_NUMERO_AYUDANTE, AS_NOMBRE_AYUDANTE, AS_NUMERO_AYUDANTE2, AS_NOMBRE_AYUDANTE2) VALUES (?,?,?,?,?,?,?,?)  `
      this.db.executeSql(this.consulta2,[this.rutamail,Date(),this.nombresVendedores[0].EM_NUMERO,this.nombresVendedores[0].EM_NOMBRE,this.nombresVendedores[1].EM_NUMERO,this.nombresVendedores[1].EM_NOMBRE,this.nombresVendedores[2].EM_NUMERO,this.nombresVendedores[2].EM_NOMBRE])
      .catch(e => console.log("las cosas se fuero a la shit aqui"));
      this.subirAsstencia()
       }else{
        this.nombresVendedores[2]={EM_NOMBRE:'Union de Ganaderos',EM_NUMERO:'9999'}
        console.log(this.nombresVendedores,"esta es donde llega el final")
        this.consulta2 = `INSERT  INTO tb_hh_asistencia  (AS_RUTA,AS_FECHA, AS_NUMERO_VENDEDOR, AS_NOMBRE_VENDEDOR, AS_NUMERO_AYUDANTE, AS_NOMBRE_AYUDANTE, AS_NUMERO_AYUDANTE2, AS_NOMBRE_AYUDANTE2) VALUES (?,?,?,?,?,?,?,?)  `
        this.db.executeSql(this.consulta2,[this.rutamail,this.fechaHoraFinal,this.nombresVendedores[0].EM_NUMERO,this.nombresVendedores[0].EM_NOMBRE,this.nombresVendedores[1].EM_NUMERO,this.nombresVendedores[1].EM_NOMBRE,this.nombresVendedores[2].EM_NUMERO,this.nombresVendedores[2].EM_NOMBRE])
        .catch(e => console.log("las cosas se fuero a la shit aqui"));
        this.subirAsstencia()
       }
     })
     
  //}

}

subirAsstencia(){
  

  console.log("aqui esta en la parte nueva")

   
    SqlServer.execute("INSERT INTO TB_HH_ASISTENCIA (AS_FECHA,AS_HORA, AS_RUTA, AS_NUM_VENDEDOR, AS_NOM_VENDEDOR, AS_NUM_AYUDANTE1, AS_NOM_AYUDANTE1, AS_NUM_AYUDANTE2, AS_NOM_AYUDANTE2)  VALUES('"+this.fechaHoraFinal+"','"+this.horaFinal+"',"+this.rutamail+","+this.nombresVendedores[0].EM_NUMERO+",'"+this.nombresVendedores[0].EM_NOMBRE+"',"+this.nombresVendedores[1].EM_NUMERO+",'"+this.nombresVendedores[1].EM_NOMBRE+"',"+this.nombresVendedores[2].EM_NUMERO+",'"+this.nombresVendedores[2].EM_NOMBRE+"')", function(event) {    
 
       alert("Ya puedes Vender : " + JSON.stringify(event));
      
     }, function(error) {
       alert("Error : " + JSON.stringify(error));
     });

}


  getData(){
   // this.showLoading();
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {  
      db.executeSql('CREATE TABLE IF NOT EXISTS clientes(CL_CLIENTE INTEGER PRIMARY KEY,CL_NOMNEGOCIO TEXT, CL_PUNTOVENTA TEXT, CL_RFC TEXT, CL_DIRNEGOCIO TEXT, CL_COLNEGOCIO TEXT, CL_CPCLIE INT, CL_CIUDADNEGOCIO TEXT, CL_CORPORACION INT, CL_RUTA INT, CL_LUNES TEXT, CL_MARTES TEXT, CL_MIERCOLES TEXT, CL_JUEVES TEXT, CL_VIERNES TEXT, CL_SABADO TEXT, CL_DOMINGO TEXT, CL_BAJA TEXT, CL_SUCURSAL INT, CL_EMPRESA INT, CL_TIPOV TEXT  )', [])      
      .then(res => console.log('Executed SQL Clientes'))
      .catch(e => console.log(e));
      db.executeSql('CREATE TABLE IF NOT EXISTS tb_hh_productos(PD_CLAVE INT, PD_NOMBRE TEXT, PD_UM TEXT, PD_GRUPO INT, PD_CANTXCAJA INT, PD_BAJA TEXT, PD_SUCURSAL INT, PD_EMPRESA INT, UM_CANTIDAD REAL, PD_IMAGEN TEXT)', [])
      .then(res => console.log('Executed SQL productos'))
      .catch(e => console.log(e));
      db.executeSql('CREATE TABLE IF NOT EXISTS tb_hh_precios(PR_TIPO_PRECIO INT, PR_CLAVE INT, PR_PRECIO REAL, PR_IVA REAL, PR_IEPS REAL, PR_SUCURSAL INT, PR_EMPRESA INT)', [])
      .then(res => console.log('Executed SQL precios'))
      .catch(e => console.log(e));
      db.executeSql('CREATE TABLE IF NOT EXISTS tb_hh_precio_cliente(PRC_RUTA_CLIE INT, PRC_CLIENTE INT, PRC_CLAVE INT, PRC_NOM_CLAVE TEXT, PRC_GRUPO INT, PRC_PRECIO_ESPECIAL REAL, PRC_IVA REAL, PRC_IEPS REAL, PRC_CORPO INT, PRC_SUCURSAL INT, PRC_EMPRESA INT)', [])
      .then(res => console.log('Executed SQL precio cliente'))
      .catch(e => console.log(e));
      db.executeSql('CREATE TABLE IF NOT EXISTS tb_hh_rutas(RT_RUTA INT, RT_NOMBRE TEXT, RT_TIPOPRECIO INT, RT_IDENTIFICADOR_EQUIPO INT, RT_SUCURSAL INT, RT_EMPRESA INT)', [])
      .then(res => console.log('Executed SQL ruta'))
      .catch(e => console.log(e));
      db.executeSql('CREATE TABLE IF NOT EXISTS tb_hh_revolventes(RV_CLIENTE INT, RV_NOM_CLIENTE TEXT, RV_RUTA INT, RV_FECHA_NOTA DATE,RV_NOTA_REVOLVENTE TEXT,RV_TOTAL_NOTA REAL, RV_IVA_NOTA REAL, RV_IEPS_NOTA REAL, RV_SUCURSAL INT, RV_EMPRESA INT )', [])
      .then(res => console.log('Executed SQL revolventes'))
      .catch(e => console.log(e));
      db.executeSql('CREATE TABLE IF NOT EXISTS tb_hh_arreglos(AR_CLIENTE INT, AR_NOM_CLIENTE TEXT, AR_RUTA INT, AR_SALDO_PENDIENTE REAL,AR_COMPLETO TEXT,AR_SUCURSAL INT, AR_EMPRESA INT )', [])
      .then(res => console.log('Executed SQL arreglos'))
      .catch(e => console.log(e));
      db.executeSql('CREATE TABLE IF NOT EXISTS tb_hh_carga_iniciales(DM_RUTA INT, DM_CLAVE INT, DM_GRUPO INT, DM_CANTIDAD INT,DM_TIPO_MOV INT,DM_USUARIO_REGISTRO INT, DM_SUCURSAL INT, DM_EMPRESA INT )', [])
      .then(res => console.log('Executed SQL cargas iniciales'))
      .catch(e => console.log(e));
      db.executeSql('CREATE TABLE IF NOT EXISTS tb_hh_promos(PM_CLAVE_PROMO INT, PM_CLAVE_PRODUCTO INT, PM_CANTIDAD INT, PM_PRECIOXUNIDAD_PROMO REAL,PM_APLICAR_RUTAS TEXT,PM_ESTATUS TEXT, PM_SUCURSAL INT,PM_EMPRESA INT )', [])
      .then(res => console.log('Executed SQL promos'))
      .catch(e => console.log(e));
      db.executeSql('CREATE TABLE IF NOT EXISTS tb_hh_inventario(IN_RUTA INT, IN_CLAVE INT, IN_GRUPO INT, IN_CANTIDAD INT,IN_TIPO_MOV INT,IN_USUARIO_REGISTRO INT, IN_SUCURSAL INT, IN_EMPRESA INT )', [])
      .then(res => console.log('Executed SQL inventario'))
      .catch(e => console.log(e));
      
      db.executeSql('CREATE TABLE IF NOT EXISTS tb_hh_nota_venta(NV_NOTA TEXT, NV_CLIENTE INT, NV_RAZON_SOCIAL TEXT, NV_NOMBRE_CLIENTE TEXT, NV_FECHA DATE, NV_RUTA INT, NV_TIPO_VENTA TEXT, NV_SUBTOTAL REAL, NV_IVA REAL, NV_IEPS REAL, NV_RECONOCIMIENTO REAL, NV_TOTAL REAL, NV_CORPO_CLIENTE INT, NV_ESTATUS_NOTA TEXT, NV_KILOLITROS_VENDIDOS REAL, NV_UPLOAD INT, NV_HORA TEXT )', [])
      .then(res => console.log('Executed SQL nota venta'))
      .catch(e => console.log(e));
      db.executeSql('CREATE TABLE IF NOT EXISTS tb_hh_nota_detalle(DN_FECHA DATE, DN_NOTA TEXT, DN_CLAVE INT, DN_DESCRIPCION TEXT, DN_CANTIDAD_PIEZAS REAL, DN_PRECIO REAL, DN_IVA REAL, DN_IEPS REAL, DN_IMPORTE REAL, DN_UPLOAD INT)', [])
      .then(res => console.log('Executed SQL nota detalle'))
      .catch(e => console.log(e));
      db.executeSql('CREATE TABLE IF NOT EXISTS tb_hh_nota_PreVenta(NPV_NOTA TEXT, NPV_CLIENTE INT, NPV_RAZON_SOCIAL TEXT, NPV_NOMBRE_CLIENTE TEXT, NPV_FECHA DATE, NPV_RUTA INT, NPV_TIPO_VENTA TEXT, NPV_SUBTOTAL REAL, NPV_IVA REAL, NPV_IEPS REAL, NPV_RECONOCIMIENTO REAL, NPV_TOTAL REAL, NPV_CORPO_CLIENTE INT, NPV_ESTATUS_NOTA TEXT, NPV_KILOLITROS_VENDIDOS REAL, NPV_UPLOAD INT, NPV_HORA TEXT )', [])
      .then(res => console.log('Executed SQL preventa'))
      .catch(e => console.log(e))
      db.executeSql('CREATE TABLE IF NOT EXISTS tb_hh_nota_PreVentaDetalle(DPN_FECHA DATE, DPN_NOTA TEXT, DPN_CLAVE INT, DPN_DESCRIPCION TEXT, DPN_CANTIDAD_PIEZAS REAL, DPN_PRECIO REAL, DPN_IVA REAL, DPN_IEPS REAL, DPN_IMPORTE REAL, DPN_UPLOAD INT)', [])
      .then(res => console.log('Executed SQL preventa detalle'))
      .catch(e => console.log(e));
      db.executeSql('CREATE TABLE IF NOT EXISTS tb_hh_nota_ventaPre(NVP_NOTA TEXT, NVP_CLIENTE INT, NVP_RAZON_SOCIAL TEXT, NVP_NOMBRE_CLIENTE TEXT, NVP_FECHA DATE, NVP_RUTA INT, NVP_TIPO_VENTA TEXT, NVP_SUBTOTAL REAL, NVP_IVA REAL, NVP_IEPS REAL, NVP_RECONOCIMIENTO REAL, NVP_TOTAL REAL, NVP_CORPO_CLIENTE INT, NVP_ESTATUS_NOTA TEXT, NVP_KILOLITROS_VENDIDOS REAL, NVP_UPLOAD INT )', [])
      .then(res => console.log('Executed SQL nota venta'))
      .catch(e => console.log(e))
      db.executeSql('CREATE TABLE IF NOT EXISTS tb_hh_nota_detallePre(DNP_FECHA DATE, DNP_NOTA TEXT, DNP_CLAVE INT, DNP_DESCRIPCION TEXT, DNP_CANTIDAD_PIEZAS REAL, DNP_PRECIO REAL, DNP_IVA REAL, DNP_IEPS REAL, DNP_IMPORTE REAL, DNP_UPLOAD INT)', [])
      .then(res => console.log('Executed SQL nota detalle'))
      .catch(e => console.log(e));
      db.executeSql('CREATE TABLE IF NOT EXISTS tb_hh_folioPre(FLP_ULTIMO_FOLIO TEXT)', [])
      .then(res => console.log('Executed SQL prefolio'))
      .catch(e => console.log(e));
      this.db.executeSql('CREATE TABLE IF NOT EXISTS tb_hh_folio(FL_ULTIMO_FOLIO TEXT)', [])
      .then(res => console.log('Executed SQL folio dolio'))
      .catch(e => console.log(e));
      this.db.executeSql('CREATE TABLE IF NOT EXISTS tb_hh_ultimo_folio(FL_ULTIMO_FOLIO TEXT, FECHA DATE)', [])
      .then(res => console.log('Executed SQL folio ultimo'))
      .catch(e => console.log(e));

      

/*****************************insertar JSON  en SQLITE********************************** */

      for(var i = 0; i<this.clientes.length; i++){

        if(this.clientes[i].CL_RUTA == this.rutamail){
          var str1 =this.clientes[i].CL_NOMNEGOCIO;
          var str2 = this.clientes[i].CL_PUNTOVENTA;
          var str3 = this.clientes[i].CL_RFC;
          var str4 =this.clientes[i].CL_DIRNEGOCIO;
          var str5 = this.clientes[i].CL_COLNEGOCIO;
          var str6 = this.clientes[i].CL_CIUDADNEGOCIO;
        var CL_CLIENTE = this.clientes[i].CL_CLIENTE;
        var CL_NOMNEGOCIO = str1.trim()
        var CL_PUNTOVENTA = str2.trim()
        var CL_RFC = str3.trim()
        var CL_DIRNEGOCIO = str4.trim()
        var CL_COLNEGOCIO = str5.trim()
        var CL_CPCLIE = this.clientes[i].CL_CPCLIE;
        var CL_CIUDADNEGOCIO = str6.trim()
        var CL_CORPORACION = this.clientes[i].CL_CORPORACION;
        var CL_RUTA = this.clientes[i].CL_RUTA;
        var CL_LUNES = this.clientes[i].CL_LUNES;
        var CL_MARTES = this.clientes[i].CL_MARTES;
        var CL_MIERCOLES = this.clientes[i].CL_MIERCOLES;
        var CL_JUEVES = this.clientes[i].CL_JUEVES;
        var CL_VIERNES = this.clientes[i].CL_VIERNES;
        var CL_SABADO = this.clientes[i].CL_SABADO;
        var CL_DOMINGO = this.clientes[i].CL_DOMINGO;
        var CL_BAJA = this.clientes[i].CL_BAJA;
        var CL_SUCURSAL = this.clientes[i].CL_SUCURSAL;
        var CL_EMPRESA = this.clientes[i].CL_EMPRESA;
        var CL_TIPOV = this.clientes[i].CL_TIPOV;

        var query1 = "INSERT INTO clientes  (CL_CLIENTE,CL_NOMNEGOCIO,CL_PUNTOVENTA,CL_RFC,CL_DIRNEGOCIO,CL_COLNEGOCIO,CL_CPCLIE,CL_CIUDADNEGOCIO,CL_CORPORACION,CL_RUTA,CL_LUNES,CL_MARTES,CL_MIERCOLES,CL_JUEVES,CL_VIERNES,CL_SABADO,CL_DOMINGO,CL_BAJA,CL_SUCURSAL, CL_EMPRESA, CL_TIPOV ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        db.executeSql(query1, [CL_CLIENTE,CL_NOMNEGOCIO,CL_PUNTOVENTA,CL_RFC,CL_DIRNEGOCIO,CL_COLNEGOCIO,
          CL_CPCLIE,CL_CIUDADNEGOCIO,CL_CORPORACION, CL_RUTA, CL_LUNES, CL_MARTES, CL_MIERCOLES, CL_JUEVES, 
          CL_VIERNES,CL_SABADO,CL_DOMINGO,CL_BAJA,CL_SUCURSAL,CL_EMPRESA,CL_TIPOV ]).then(function(res) {
        }, function (err) {
          console.error(err);
        });
        }
      }

   
      
      for(var i = 0; i<this.productos.length; i++){

        for(var e = 0; e<this.img.length; e++){
          this.imgDefault ='assets/imgs/logo.png'
          
          //console.log(this.img.length, e," larog de fotos, largo recorido")
          if(this.productos[i].PD_CLAVE === this.img[e].clave){

          var PD_CLAVE = this.productos[i].PD_CLAVE;
          var PD_NOMBRE = this.productos[i].PD_NOMBRE.replace(/(^\s+|\s+$)/g,'');
          var PD_UM = this.productos[i].PD_UM;
          var PD_GRUPO = this.productos[i].PD_GRUPO;
          var PD_CANTXCAJA = this.productos[i].PD_CANTXCAJA;
          var PD_BAJA = this.productos[i].PD_BAJA;
          var PD_SUCURSAL = this.productos[i].PD_SUCURSAL;
          var PD_EMPRESA = this.productos[i].PD_EMPRESA;
          var UM_CANTIDAD = this.productos[i].UM_CANTIDAD;
          var PD_IMAGEN = this.img[e].imgs;
  
          var query2 = "INSERT INTO tb_hh_productos(PD_CLAVE,PD_NOMBRE,PD_UM,PD_GRUPO,PD_CANTXCAJA, PD_BAJA, PD_SUCURSAL, PD_EMPRESA, UM_CANTIDAD, PD_IMAGEN ) VALUES (?,?,?,?,?,?,?,?,?,?)";
          db.executeSql(query2, [PD_CLAVE,PD_NOMBRE,PD_UM,PD_GRUPO,PD_CANTXCAJA,PD_BAJA,
            PD_SUCURSAL,PD_EMPRESA,UM_CANTIDAD,PD_IMAGEN]).then(function(res) {
          }, function (err) {
            console.error(err);
          });
          }
          
        }
        
      }

      for(var i = 0; i<this.precios.length; i++){
        var PR_TIPO_PRECIO = this.precios[i].PR_TIPO_PRECIO;
        var PR_CLAVE = this.precios[i].PR_CLAVE;
        var PR_PRECIO = this.precios[i].PR_PRECIO;
        var PR_IVA = this.precios[i].PR_IVA;
        var PR_IEPS = this.precios[i].PR_IEPS;
        var PR_SUCURSAL = this.precios[i].PR_SUCURSAL;
        var PR_EMPRESA = this.precios[i].PR_EMPRESA;
        var query3 = "INSERT INTO tb_hh_precios(PR_TIPO_PRECIO, PR_CLAVE, PR_PRECIO, PR_IVA, PR_IEPS, PR_SUCURSAL, PR_EMPRESA ) VALUES (?,?,?,?,?,?,?)";
        db.executeSql(query3, [PR_TIPO_PRECIO, PR_CLAVE, PR_PRECIO, PR_IVA, PR_IEPS, PR_SUCURSAL, PR_EMPRESA ]).then(function(res) {
        }, function (err) {
          console.error(err);
        });
      }

      for(var i = 0; i<this.precioCliente.length; i++){

        if(this.precioCliente[i].PRC_RUTA_CLIE === this.rutamail){

        var PRC_RUTA_CLIE = this.precioCliente[i].PRC_RUTA_CLIE;
        var PRC_CLIENTE = this.precioCliente[i].PRC_CLIENTE;
        var PRC_CLAVE = this.precioCliente[i].PRC_CLAVE;
        var PRC_NOM_CLAVE = this.precioCliente[i].PRC_NOM_CLAVE;
        var PRC_GRUPO = this.precioCliente[i].PRC_GRUPO;
        var PRC_PRECIO_ESPECIAL = this.precioCliente[i].PRC_PRECIO_ESPECIAL;
        var PRC_IVA = this.precioCliente[i].PRC_IVA;
        var PRC_IEPS = this.precioCliente[i].PRC_IEPS;
        var PRC_CORPO = this.precioCliente[i].PRC_CORPO;
        var PRC_SUCURSAL = this.precioCliente[i].PRC_SUCURSAL;
        var PRC_EMPRESA = this.precioCliente[i].PRC_EMPRESA;
        var query4 = "INSERT INTO tb_hh_precio_cliente(PRC_RUTA_CLIE, PRC_CLIENTE, PRC_CLAVE, PRC_NOM_CLAVE, PRC_GRUPO, PRC_PRECIO_ESPECIAL, PRC_IVA, PRC_IEPS, PRC_CORPO, PRC_SUCURSAL, PRC_EMPRESA) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
        db.executeSql(query4, [PRC_RUTA_CLIE, PRC_CLIENTE, PRC_CLAVE, PRC_NOM_CLAVE, PRC_GRUPO, PRC_PRECIO_ESPECIAL, PRC_IVA, PRC_IEPS, PRC_CORPO, PRC_SUCURSAL, PRC_EMPRESA]).then(function(res) {
        }, function (err) {
          console.error(err);
          //this.presentToast(err)
        });
        }
      }
    

      for(var i = 0; i<this.ruta.length; i++){

        if(this.ruta[i].RT_RUTA === this.rutamail){

          var RT_RUTA = this.ruta[i].RT_RUTA;
          var RT_NOMBRE = this.ruta[i].RT_NOMBRE;
          var RT_TIPOPRECIO = this.ruta[i].RT_TIPOPRECIO;
          var RT_IDENTIFICADOR_EQUIPO = this.ruta[i].RT_IDENTIFICADOR_EQUIPO;
          var RT_SUCURSAL = this.ruta[i].RT_SUCURSAL;
          var RT_EMPRESA = this.ruta[i].RT_EMPRESA;
          var query5 = "INSERT INTO tb_hh_rutas(RT_RUTA, RT_NOMBRE, RT_TIPOPRECIO, RT_IDENTIFICADOR_EQUIPO, RT_SUCURSAL, RT_EMPRESA) VALUES (?,?,?,?,?,?)"
          db.executeSql(query5, [RT_RUTA, RT_NOMBRE, RT_TIPOPRECIO, RT_IDENTIFICADOR_EQUIPO, RT_SUCURSAL, RT_EMPRESA]).then(function(res) {
          }, function (err) {
            console.error(err);
            //this.presentToast(err)
          });
          }
        }



          for(var i = 0; i<this.tb_hh_revolventes.length; i++){

            if(this.tb_hh_revolventes[i].RV_RUTA == this.rutamail){
    
              var RV_CLIENTE = this.tb_hh_revolventes[i].RV_CLIENTE;
              var RV_NOM_CLIENTE = this.tb_hh_revolventes[i].RV_NOM_CLIENTE;
              var RV_RUTA = this.tb_hh_revolventes[i].RV_RUTA;
              var RV_FECHA_NOTA = this.tb_hh_revolventes[i].RV_FECHA_NOTA;
              var RV_NOTA_REVOLVENTE = this.tb_hh_revolventes[i].RV_NOTA_REVOLVENTE;
              var RV_TOTAL_NOTA = this.tb_hh_revolventes[i].RV_TOTAL_NOTA;
              var RV_IVA_NOTA = this.tb_hh_revolventes[i].RV_IVA_NOTA;
              var RV_IEPS_NOTA = this.tb_hh_revolventes[i].RV_IEPS_NOTA;
              var RV_SUCURSAL = this.tb_hh_revolventes[i].RV_SUCURSAL;
              var RV_EMPRESA = this.tb_hh_revolventes[i].RV_EMPRESA;
              var query7 = "INSERT INTO tb_hh_revolventes(RV_CLIENTE, RV_NOM_CLIENTE, RV_RUTA, RV_FECHA_NOTA, RV_NOTA_REVOLVENTE, RV_TOTAL_NOTA,RV_IVA_NOTA,RV_IEPS_NOTA,RV_SUCURSAL,RV_EMPRESA) VALUES (?,?,?,?,?,?,?,?,?,?)"
              db.executeSql(query7, [RV_CLIENTE, RV_NOM_CLIENTE, RV_RUTA, RV_FECHA_NOTA, RV_NOTA_REVOLVENTE, RV_TOTAL_NOTA,RV_IVA_NOTA,RV_IEPS_NOTA,RV_SUCURSAL,RV_EMPRESA]).then(function(res) {
              }, function (err) {
                console.error(err);
                //this.presentToast(err)
              });
              }
            }

            for(var i = 0; i<this.arreglos.length; i++){

               if(this.arreglos[i].AR_RUTA == this.rutamail){
       
                 var AR_CLIENTE = this.arreglos[i].AR_CLIENTE;
                 var AR_NOM_CLIENTE = this.arreglos[i].AR_NOM_CLIENTE;
                 var AR_RUTA = this.arreglos[i].AR_RUTA;
                 var AR_SALDO_PENDIENTE = this.arreglos[i].AR_SALDO_PENDIENTE;
                 var AR_COMPLETO = this.arreglos[i].AR_COMPLETO;
                 var AR_SUCURSAL = this.arreglos[i].AR_SUCURSAL;
                 var AR_EMPRESA = this.arreglos[i].AR_EMPRESA;
                 var query8 = "INSERT INTO tb_hh_arreglos(AR_CLIENTE, AR_NOM_CLIENTE, AR_RUTA, AR_SALDO_PENDIENTE, AR_COMPLETO, AR_SUCURSAL,AR_EMPRESA)VALUES (?,?,?,?,?,?,?)"
                 db.executeSql(query8, [AR_CLIENTE, AR_NOM_CLIENTE, AR_RUTA, AR_SALDO_PENDIENTE, AR_COMPLETO, AR_SUCURSAL,AR_EMPRESA]).then(function(res) {
                 }, function (err) {
                   console.error(err);
                   //this.presentToast(err)
                 });
                 }
               }

               


                for(var i = 0; i<this.cargasIniciales.length; i++){

                   if(this.cargasIniciales[i].DM_RUTA === this.rutamail){
           
                     var DM_RUTA = this.cargasIniciales[i].DM_RUTA;
                     var DM_CLAVE = this.cargasIniciales[i].DM_CLAVE;
                     var DM_GRUPO = this.cargasIniciales[i].DM_GRUPO;
                     var DM_CANTIDAD = this.cargasIniciales[i].DM_CANTIDAD;
                     var DM_TIPO_MOV = this.cargasIniciales[i].DM_TIPO_MOV;
                     var DM_USUARIO_REGISTRO = this.cargasIniciales[i].DM_USUARIO_REGISTRO;
                     var DM_SUCURSAL = this.cargasIniciales[i].DM_SUCURSAL;
                     var DM_EMPRESA = this.cargasIniciales[i].DM_EMPRESA;
                     var query9 = "INSERT INTO tb_hh_carga_iniciales(DM_RUTA, DM_CLAVE, DM_GRUPO, DM_CANTIDAD, DM_TIPO_MOV, DM_USUARIO_REGISTRO,DM_SUCURSAL,DM_EMPRESA)VALUES (?,?,?,?,?,?,?,?)"
                     db.executeSql(query9, [DM_RUTA, DM_CLAVE, DM_GRUPO, DM_CANTIDAD, DM_TIPO_MOV, DM_USUARIO_REGISTRO,DM_SUCURSAL,DM_EMPRESA]).then(function(res) {
                     }, function (err) {
                       console.error(err);
                       //this.presentToast(err)
                     });
                     }
                   }

                  //PROMOCIONES
                   for(var i = 0; i<this.promos.length; i++){

                       var PM_CLAVE_PROMO = this.promos[i].PM_CLAVE_PROMO;
                       var PM_CLAVE_PRODUCTO = this.promos[i].PM_CLAVE_PRODUCTO;
                       var PM_CANTIDAD = this.promos[i].PM_CANTIDAD;
                       var PM_PRECIOXUNIDAD_PROMO = this.promos[i].PM_PRECIOXUNIDAD_PROMO;
                       var PM_APLICAR_RUTAS = this.promos[i].PM_APLICAR_RUTAS;
                       var PM_ESTATUS = this.promos[i].PM_ESTATUS;
                       var PM_SUCURSAL = this.promos[i].PM_SUCURSAL;
                       var PM_EMPRESA = this.promos[i].PM_EMPRESA;
                       var query10 = "INSERT INTO tb_hh_promos(PM_CLAVE_PROMO,PM_CLAVE_PRODUCTO,PM_CANTIDAD,PM_PRECIOXUNIDAD_PROMO,PM_APLICAR_RUTAS,PM_ESTATUS,PM_SUCURSAL,PM_EMPRESA)VALUES (?,?,?,?,?,?,?,?)"
                       db.executeSql(query10, [PM_CLAVE_PROMO,PM_CLAVE_PRODUCTO,PM_CANTIDAD,PM_PRECIOXUNIDAD_PROMO,PM_APLICAR_RUTAS,PM_ESTATUS,PM_SUCURSAL,PM_EMPRESA]).then(function(res) {
                       }, function (err) {
                         console.error(err);
                         
                       });
                       //}
                     }
                 // PEDIDOS
                 
              

                     
                     //TABLA INVENTARIO:La primera vez sera igual a la tabla de cargas iniciales
                     for(var i = 0; i<this.cargasIniciales.length; i++){

                      if(this.cargasIniciales[i].DM_RUTA === this.rutamail){
              
                        var IN_RUTA = this.cargasIniciales[i].DM_RUTA;
                        var IN_CLAVE = this.cargasIniciales[i].DM_CLAVE;
                        var IN_GRUPO = this.cargasIniciales[i].DM_GRUPO;
                        var IN_CANTIDAD = this.cargasIniciales[i].DM_CANTIDAD;
                        var IN_TIPO_MOV = this.cargasIniciales[i].DM_TIPO_MOV;
                        var IN_USUARIO_REGISTRO = this.cargasIniciales[i].DM_USUARIO_REGISTRO;
                        var IN_SUCURSAL = this.cargasIniciales[i].DM_SUCURSAL;
                        var IN_EMPRESA = this.cargasIniciales[i].DM_EMPRESA;
                        var query11 = "INSERT INTO tb_hh_inventario(IN_RUTA, IN_CLAVE, IN_GRUPO, IN_CANTIDAD, IN_TIPO_MOV, IN_USUARIO_REGISTRO,IN_SUCURSAL,IN_EMPRESA)VALUES (?,?,?,?,?,?,?,?)"
                        db.executeSql(query11, [IN_RUTA, IN_CLAVE, IN_GRUPO, IN_CANTIDAD, IN_TIPO_MOV, IN_USUARIO_REGISTRO,IN_SUCURSAL,IN_EMPRESA]).then(function(res) {
                        }, function (err) {
                          console.error(err);
                          //this.presentToast(err)
                        });
                        }
                      }

                      

                     //GENERA EL PRIMER FOLIO
                     
                     //Agrega un cero al numero de dia cuando sea menor a 10
                     if(this.dia<10)
                     {this.diaStr='0'+this.dia;}

                     //Agrega un cero al numero de mes cuando sea menor a 10
                     //if(this.mes<10)
                     //{this.mesStr ='0'+this.mes;}

                     //SWITCH PARA EL MES PARA EL COMER DEL DIABLO PARA EL FOLIO DEL DIABLO
                      console.log(this.mes)
                     switch(this.mes){
                       case 1:{
                        this.mesStr = 'A'
                        break
                       }
                       case 2:{
                        this.mesStr = 'B'
                        break
                       }
                       case 3:{
                        this.mesStr = 'C'
                        break
                       }
                       case 4:{
                        this.mesStr = 'D'
                        break
                       }
                       case 5:{
                        this.mesStr = 'X'
                        break
                       }
                       case 6:{
                        this.mesStr = 'F'
                        break
                       }
                       case 7:{
                        this.mesStr = 'G'
                        break
                       }
                       case 8:{
                        this.mesStr = 'H'
                        break
                       }
                       case 9:{
                        this.mesStr = 'I'
                        break
                       }
                       case 10:{
                        this.mesStr = 'J'
                        break
                       }
                       case 11:{
                        this.mesStr = 'K'
                        break
                       }
                       case 12:{
                        this.mesStr = 'L'
                        break
                       }
                     }

                     //Extrae solo los ultimos dos digitos del año en curso
                     this.anioStr=this.anio.toString().substring(2);

                     //Concatena ceros al numero de ruta segun la cantidad de carasteres en el numero
                     /*
                     if(this.rutaStr.length==1)
                     {this.rutaStr='000'+this.rutaStr;}
                     if(this.rutaStr.length==2)
                     {this.rutaStr='00'+this.rutaStr;}
                     if(this.rutaStr.length==3)
                     {this.rutaStr='0'+this.rutaStr;}
                     */
                    //CAMBIO DE RUTA PARA EL COMER DEL DIABLO
                    if(this.rutaStr.length == 1){
                      this.rutaStr = '0'+this.rutaStr;
                    }else if(this.rutamail>=100){
                      switch(this.rutaStr){
                        case '100':{
                          this.rutaStr = 'A0'
                          break
                        }
                        case '101':{
                          this.rutaStr = 'A1'
                          break
                        }
                        case '102':{
                          this.rutaStr = 'A2'
                          break
                        }
                        case '103':{
                          this.rutaStr = 'A3'
                          break
                        }
                        case '104':{
                          this.rutaStr = 'A4'
                          break
                        }
                        case '105':{
                          this.rutaStr = 'A5'
                          break
                        }
                        case '106':{
                          this.rutaStr = 'A6'
                          break
                        }
                        case '107':{
                          this.rutaStr = 'A7'
                          break
                        }
                        case '108':{
                          this.rutaStr = 'A8'
                          break
                        }
                        case '109':{
                          this.rutaStr = 'A9'
                          break
                        }
                      }
                    }else if(this.rutamail>=110){
                      switch(this.rutaStr){
                        case '110':{
                          this.rutaStr = 'B0'
                          break
                        }
                        case '111':{
                          this.rutaStr = 'B1'
                          break
                        }
                        case '112':{
                          this.rutaStr = 'B2'
                          break
                        }
                        case '113':{
                          this.rutaStr = 'B3'
                          break
                        }
                        case '114':{
                          this.rutaStr = 'B4'
                          break
                        }
                        case '115':{
                          this.rutaStr = 'B5'
                          break
                        }
                        case '116':{
                          this.rutaStr = 'B6'
                          break
                        }
                        case '117':{
                          this.rutaStr = 'B7'
                          break
                        }
                        case '118':{
                          this.rutaStr = 'B8'
                          break
                        }
                        case '119':{
                          this.rutaStr = 'B9'
                          break
                        }
                      }
                    }else if(this.rutamail>=120){
                      switch(this.rutaStr){
                        case '120':{
                          this.rutaStr = 'C0'
                          break
                        }
                        case '121':{
                          this.rutaStr = 'C1'
                          break
                        }
                        case '122':{
                          this.rutaStr = 'C2'
                          break
                        }
                        case '123':{
                          this.rutaStr = 'C3'
                          break
                        }
                        case '124':{
                          this.rutaStr = 'C4'
                          break
                        }
                        case '125':{
                          this.rutaStr = 'C5'
                          break
                        }
                        case '126':{
                          this.rutaStr = 'C6'
                          break
                        }
                        case '127':{
                          this.rutaStr = 'C7'
                          break
                        }
                        case '128':{
                          this.rutaStr = 'C8'
                          break
                        }
                        case '129':{
                          this.rutaStr = 'C9'
                          break
                        }
                      }
                    }else if(this.rutamail>=130){
                      switch(this.rutaStr){
                        case '130':{
                          this.rutaStr = 'D0'
                          break
                        }
                        case '131':{
                          this.rutaStr = 'D1'
                          break
                        }
                        case '132':{
                          this.rutaStr = 'D2'
                          break
                        }
                        case '133':{
                          this.rutaStr = 'D3'
                          break
                        }
                        case '134':{
                          this.rutaStr = 'D4'
                          break
                        }
                        case '135':{
                          this.rutaStr = 'D5'
                          break
                        }
                        case '136':{
                          this.rutaStr = 'D6'
                          break
                        }
                        case '137':{
                          this.rutaStr = 'D7'
                          break
                        }
                        case '138':{
                          this.rutaStr = 'D8'
                          break
                        }
                        case '139':{
                          this.rutaStr = 'D9'
                          break
                        }
                      }
                    }
                     //Guarda el folio en variable

                     
                     
                     //this.folioIni=this.rutaStr+this.diaStr+this.mesStr+this.anioStr+'000';
                     this.folioIni = this.rutaStr+this.mesStr+this.diaStr+'000'
                     console.log(this.folioIni+ '      ->folio Inicializado');
                     this.prefolioIni= 'p'+this.folioIni;
                     console.log(this.prefolioIni+ '      ->prefolio Inicializado');



                     var query12 = "INSERT INTO tb_hh_folio(FL_ULTIMO_FOLIO)VALUES (?)"
                      db.executeSql(query12,[this.folioIni]);
                      
                     
                    
                    
                    var query13 = "INSERT INTO tb_hh_folioPre(FLP_ULTIMO_FOLIO)VALUES (?)"
                    db.executeSql(query13,[this.prefolioIni])
                      
                      
                    


/***************************************************************** */

      })
      
   }

   folioCambio(){
     
    return  SqlServer.executeQuery(`SELECT TOP 1 NV_NOTA FROM TB_HH_NOTA_VENTA WHERE NV_FECHA = CAST(GETDATE() AS Date) AND NV_RUTA =`+this.rutamail+`  ORDER BY NV_NOTA DESC `, function(event) {
      /*
      var folio=JSON.stringify(event)
      console.log(folio)

      if(folio !='"[[]]"'){
        
        const folioTrim = folio.replace(/[.*+?^${}()|[\]\\]/g,' ');
        const folio2 = folioTrim.replace(/"/g,' ');
        const stringlimpio = folio2.replace(/\s/g, "")
        const parts = stringlimpio.split(':',2)
        const el_foliokun = parts[1];
        return el_foliokun
        
         
      }else{
        var query12 = "INSERT INTO tb_hh_folio(FL_ULTIMO_FOLIO)VALUES (?)"
     // db.executeSql(query12,[this.folioIni]);
      }
     */
    }, function(error) {
      alert("Error : " + JSON.stringify(error));
    })
   
   }

   mangeku(){
    this.folioCambio().then(res =>{
      var folio=JSON.stringify(res)
      console.log(folio, "folio del mangeku")

      if(folio !='"[[]]"'){
        
        const folioTrim = folio.replace(/[.*+?^${}()|[\]\\]/g,' ');
        const folio2 = folioTrim.replace(/"/g,' ');
        const stringlimpio = folio2.replace(/\s/g, "")
        const parts = stringlimpio.split(':',2)
        const el_foliokun = parts[1];
        return el_foliokun
        
         
      }else{
        var query12 = "INSERT INTO tb_hh_folio(FL_ULTIMO_FOLIO)VALUES (?)"
     // db.executeSql(query12,[this.folioIni]);
      }
    })
   }

   traspaso(){
    this.navCtrl.setRoot("TraspasosPage");
   }



   


}