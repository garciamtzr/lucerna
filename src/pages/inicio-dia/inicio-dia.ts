import { NotapreProvider } from './../../providers/notapre/notapre';
import { NotaVentaProvider } from './../../providers/nota-venta/nota-venta';
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
import { PedidosProvider } from './../../providers/pedidos/pedidos';


/**
 * Generated class for the InicioDiaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-inicio-dia',
  templateUrl: 'inicio-dia.html',
})
export class InicioDiaPage {

  objeto: any;
  loading: any;
  rutamail
  

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
  pedidos = [];

  cargasIniciales = [];
  notapre
  detallepre
  promos = [];
  AS_NUMERO_VENDEDOR
  AS_NUMERO_AYUDANTE
  AS_NUMERO_AYUDANTE2


  LimpiarClientes:string;
  LimpiarProductos:string;
  LimpiarPrecios:string;
  LimpiarPreciosCliente:string;
  LimpiarArreglos:string;
  LimpiarCargaInicial:string;
  LimpiarRevolvente:string;
  LimpiarRutas:string;
  LimpiarUsuarios :string;
  LimpiarPromos:string;
  LimpiarFolios: string;
  LimpiarInventario:string;
  LimpiarNotas:string;
  LimpiarDetalleNotas:string;
  LimpiarPedidos:string;
  LimpiarPreVenta:string;
  LimpiarPreVentaDetalle:string;
  LimpiarPreFolio:string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public sqlite: SQLite,
    private cliente: ClienteProvider,
    private producto:ProductoProvider,
    private precioClientes: PrecioClienteProvider,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private Storage: Storage,
    private precioCtrl: PrecioProvider,
    private rutaProvider:RutaProvider,
    private TbUsuarios: TbHhUsuariosProvider,
    private revolventes: RevolventesProvider,
    private arreglosJSON: ArregloProvider,
    private PedidosProvider: PedidosProvider,
    private cargaInicial: CargaInicialProvider,
    private view: ViewController,
    private notaPrem:NotapreProvider,
    private promosiones: PromosProvider) {
      this.getJSON()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InicioDiaPage');
   
  }

  ionViewWillEnter(){
    this.Storage.get('asistencia').then(loggedIn =>{
      if(loggedIn !== null){
        this.navCtrl.setRoot("DescargaListasPage");
      }
    });
  }

  //********************************************************************************/

showPrompt(){   //ventana emergente para agregar cantidad de piezas
     
    
  const prompt = this.alertCtrl.create({
       

    title:'Cantidad',
    message:"Agrege cantidad a vender",
    inputs: [
      {
        name:'idVendedor',
        placeholder:'# Numero de Reloj Vendedor',
        type:'number',
      },{
        name:'idAyudante',
        placeholder:'9999',
        value:'9999',
        type:'number',
      },{
        name:'idAyudante2',
        placeholder:'9999',
        value:'9999',
        type:'number',
      }
    ],
    buttons:[
      {
        text: 'Cancelar',
        handler: data =>{
          console.log('cancelado');
        }
    },
    {
      
      text:'Guardar',
      handler: data=>{
   
      this.objeto = [    //si usamos [{ ...}], [{ ... }]  crea un arreglo de arreglos
      this.AS_NUMERO_VENDEDOR = data.idVendedor,
      this.AS_NUMERO_AYUDANTE = data.idAyudante,
      this.AS_NUMERO_AYUDANTE2 = data.idAyudante2
    ]
    this.borrarSQL()
      //this.objeto = [this.AS_NUMERO_VENDEDOR,this.AS_NUMERO_AYUDANTE, this.AS_NUMERO_AYUDANTE2]
      console.log(this.objeto)
      this.Storage.set('asistencia', this.objeto);
      this.navCtrl.setRoot("DescargaListasPage",{clientes:this.clientes,
         productos:this.productos,
         precios:this.precios,
         precioCliente:this.precioCliente,
         ruta:this.ruta,
         tb_hh_usuarios:this.tb_hh_usuarios,
         tb_hh_revolventes:this.tb_hh_revolventes,
         arreglos:this.arreglos,
         cargasIniciales:this.cargasIniciales,
         promos:this.promos,
        pedidos:this.pedidos,
        notaPre:this.notapre});

      }

 
    }
   
    ]
  });
  prompt.present();
}

//******************************************************************************* */

async getJSON(){
  try{
  const cliePromise = this.cliente.getClientes().subscribe(res =>{
    console.log(res);
    this.clientes = res.result;});

  const prodPromise = this.producto.getProductos().subscribe(res =>{
    console.log(res);
    this.productos = res.result;});

   const precioPromise =  this.precioCtrl.getPrecios().subscribe(res =>{
    console.log(res);
    this.precios = res.result;});

   const precliePromise = this.precioClientes.getPrecioClientes().subscribe(res =>{
    console.log(res);
    this.precioCliente = res.result;});

    const rutaPromise =   this.rutaProvider.getRutas().subscribe(res =>{
      console.log(res);
      this.ruta = res.result;});

    const vendedoresPromise = this.TbUsuarios.getUsuarios().subscribe(res =>{
      console.log(res);
      this.tb_hh_usuarios = res.result;});

    const revolver = this.revolventes.getRevolventes().subscribe(res =>{
      console.log(res);
      this.tb_hh_revolventes = res.result;});
   
    const arregloPromise = this.arreglosJSON.getArreglo().subscribe(res =>{
      console.log(res);
      this.arreglos = res.result;});

    const cargaPromise = this.cargaInicial.getCargaInicial().subscribe(res =>{
        console.log(res);
        this.cargasIniciales = res.result;});

    const PromoPromise = this.promosiones.getPromos().subscribe(res =>{
          console.log(res);
          this.promos = res.result;});

    const NotasPres = this.notaPrem.getNotasPre().subscribe(res =>{
      console.log(res);
      this.notapre = res.result;});

   // const pedidoPromise = this.PedidosProvider.getPedidos().subscribe(res =>{
      //console.log(res)
     // this.pedidos = res.result;});
    

    await Promise.all([cliePromise,prodPromise,precioPromise,precliePromise,rutaPromise,
      vendedoresPromise,revolver,arregloPromise,cargaPromise,PromoPromise,NotasPres]);
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


borrarSQL(){
  this.sqlite.create({
    name: 'ionicdb.db',
    location: 'default'
  }).then((db: SQLiteObject) => {

     this.LimpiarClientes = `DROP TABLE clientes`
     db.executeSql(this.LimpiarClientes,[])

     this.LimpiarArreglos = `DROP TABLE tb_hh_arreglos`
     db.executeSql(this.LimpiarArreglos,[])

     this.LimpiarCargaInicial = `DROP TABLE tb_hh_carga_iniciales`
     db.executeSql(this.LimpiarCargaInicial,[])
      
    this.LimpiarPrecios = `DROP TABLE tb_hh_precios`
    db.executeSql(this.LimpiarPrecios,[])

    this.LimpiarPreciosCliente = `DROP TABLE tb_hh_precio_cliente`
    db.executeSql(this.LimpiarPreciosCliente,[])

    this.LimpiarProductos = `DROP TABLE  tb_hh_productos`
    db.executeSql(this.LimpiarProductos,[])

    this.LimpiarRevolvente = `DROP TABLE tb_hh_revolventes`
    db.executeSql(this.LimpiarRevolvente,[])

    this.LimpiarRutas = `DROP TABLE tb_hh_rutas`
    db.executeSql(this.LimpiarRutas,[])

    this.LimpiarUsuarios = `DROP TABLE tb_hh_usuarios`
    db.executeSql(this.LimpiarUsuarios,[])

    this.LimpiarPromos = `DROP TABLE tb_hh_promos`
    db.executeSql(this.LimpiarPromos,[])

    this.LimpiarFolios = `DROP TABLE tb_hh_folio`
    db.executeSql(this.LimpiarFolios,[])

    this.LimpiarFolios = `DROP TABLE tb_hh_folioPre`
    db.executeSql(this.LimpiarFolios,[])

    this.LimpiarInventario = `DROP TABLE tb_hh_inventario`
    db.executeSql(this.LimpiarInventario,[])

    this.LimpiarNotas = `DROP TABLE tb_hh_nota_venta`
    db.executeSql(this.LimpiarNotas,[])

    this.LimpiarDetalleNotas = `DROP TABLE tb_hh_nota_detalle`
    db.executeSql(this.LimpiarDetalleNotas,[])

    this.LimpiarPedidos = 'DROP TABLE tb_hh_pedidos' 
    db.executeSql(this.LimpiarPedidos,[])

    this.LimpiarPreVenta = 'DROP TABLE tb_hh_nota_PreVenta' 
    db.executeSql(this.LimpiarPreVenta,[])

    this.LimpiarPreVentaDetalle = 'DROP TABLE tb_hh_nota_PreVentaDetalle' 
    db.executeSql(this.LimpiarPreVentaDetalle,[])

    this.LimpiarPreFolio = 'DROP TABLE tb_hh_folioPre'
    db.executeSql(this.LimpiarPreFolio,[])
  })
}


}
