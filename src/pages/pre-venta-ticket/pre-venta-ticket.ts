import { Component, ɵConsole, SimpleChange } from '@angular/core';
import {IonicPage, NavController,ModalController,AlertController, NavParams,ToastController,  ViewController} from 'ionic-angular';
import {PreprintProvider} from '../../providers/preprint/preprint';
import {PrinterListModalPage} from '../printer-list-modal/printer-list-modal';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import{Storage} from '@ionic/storage'
import {NotaVentaProvider} from '../../providers/nota-venta/nota-venta'
import { ClientesPage } from '../clientes/clientes';

/**
 * Generated class for the PreVentaTicketPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pre-venta-ticket',
  templateUrl: 'pre-venta-ticket.html',
})
export class PreVentaTicketPage {

  
  selectedPrinter:any=[];

  //Variables para recibir la informacion desde el carrito
  cliente: any;  //variable que recibe arreglo
  clavesVta:any;  //variable que recibe arreglo
 
  tipoVentaCliente:String; //datos del total de la venta
  reconocimientoVta:Number;
  reconocimientoSobrante:Number;
  reconocimientoCompleto:string; //guarda una S o N si el arreglo ya fue concluido.
  subtotalVta:Number;
  IVAVta:Number;
  IEPSVta:Number;
  totalFinal:Number;
  KLAcumVta:Number;
 
  rutamail:number;

  tipoImpresion:string;

  fechaActual2=new Date();
  horaFinal: string;
  //variables para mostrar el horario
   Hora = this.fechaActual2.getHours();
   Minutos = this.fechaActual2.getMinutes();
   Segundos = this.fechaActual2.getSeconds();

   //VARIABLES***********

   producto: any;
   consulta: string;
   consulta1: string;
   cantidadVenta: number[];
   cantidadActual: number[];
   cantidadNUeva: number[];
   claveProd: Number[];
   cantNum:number;
   largoArreglos: Number;
   clavenum: Number;

   vendedor: Number;
   nomVendedor: string;
 //****************** */

    ultimoFolio:string;
    consultaFolio:string;
    nuevoStrNota:string; //guarda el nuevo folio de nota en formato string.
    nuevoNumNota:number; // guarda el nuevo folio de nota en formato numerico.
    updateFol:string; //string para el update del folio

    InsertaVta:string; //inserta los datos de la nota de venta en la tabla de SQLite
    InsertaDetaVta:string;
    tipoTicket:string;

    //variable para fecha
    fechaActual=new Date();
    fechaHoraFinal:string;
    
       //variables tipo string para mostrar el horario
    h='';
    m='';
    s='';
   
    updateReconocimiento:string; //string para el update del arreglo restante

    db:SQLiteObject;

    errorImpresion:string;
     nav;

     ventafinal: any=[];

  constructor(public navCtrl: NavController,private modalCtrl:ModalController,
    private printProvider:PreprintProvider,  private view: ViewController,
    private alertCtrl:AlertController,
    public navParams: NavParams,  private toastCtrl: ToastController,
    public Storage:Storage, private sqlite: SQLite, private notaVenta: NotaVentaProvider) {
      
      this.nav=navCtrl;
      //proceso para recibir la informacion desde el carrito
      this.cliente = navParams.get('cliente'); //arreglo para datos del cliente
      console.log('CLIENTE EN TICKET',this.cliente)
      this.clavesVta = navParams.get('productos'); //arreglo para datos de la venta

      this.tipoVentaCliente = navParams.get('tipoVentaCliente'); //informacion del total de la venta
      this.reconocimientoVta = navParams.get('reconocimientoVta'); 
      this.reconocimientoSobrante=navParams.get('reconocimientoSobrante');
      this.subtotalVta = navParams.get('subtotalVta'); 
      this.IVAVta = navParams.get('IVAVta'); 
      this.totalFinal = navParams.get('totalFinal'); 
      this.KLAcumVta = navParams.get('KLAcumVta'); 
      this.IEPSVta = navParams.get('IEPSVta'); 
      this.tipoImpresion='';

      this.producto = JSON.parse(JSON.stringify(this.navParams.get('producto'))); 

      this.horaFinal=this.Hora+":"+this.Minutos+":"+this.Segundos
      this.Storage.get('vendedor').then((val) =>{
        this.vendedor = parseInt(val);
        console.log(this.vendedor)
      })
      this.horaFinal=this.Hora+":"+this.Minutos+":"+this.Segundos
      this.Storage.get('nomVendedor').then((va) =>{
        this.nomVendedor = va;
        console.log(this.nomVendedor)
      })

    
  }
  ionViewDidEnter(){
    this.obtenerCantidades();
    
   }




   obtenerCantidades(){
    console.log(this.producto.length)
    this.claveProd = []
      this.cantidadVenta = []
    for(var i = 0;i<this.producto.length; i++ ){
      //console.log(this.producto.cantidad)
      this.claveProd.push(parseInt(this.producto[i]['clave'])) 
      this.cantidadVenta.push(parseInt(this.producto[i]['cantidad']))
      console.log(this.cantidadVenta)
      
    }
    this.getCantidad(this.claveProd, this.cantidadVenta)
    //console.log(this.cantidadVenta)

  }

  getCantidad(clave, cant){
    //return new Promise(function(resolve, reject)
     this.sqlite.create({
       name: 'ionicdb.db',
       location: 'default'
     }).then((db: SQLiteObject) => {
      console.log(clave,"Claves")
      console.log(cant, "cantidad de ventas")
      this.cantidadActual = []; 
         for(var e =0; e<clave.length; e++){
          
        this.consulta = `select IN_CANTIDAD FROM tb_hh_inventario WHERE IN_CLAVE =?`
        this.clavenum = clave[e];
        console.log(this.clavenum)
                
        db.executeSql(this.consulta,[this.clavenum])
        .then(res => {
          
          for(var a=0; a<res.rows.length; a++) {
            this.cantidadActual.push(res.rows.item(a).IN_CANTIDAD) 
            console.log(this.cantidadActual, "cantidad en int")
          }
        
          
          }).catch(e => console.log(e));
          
          
      }
     
    }).then(res =>{
     

      })
    
   }


   showPrompt(){   //ventana emergente para agregar cantidad de piezas
          
    const prompt = this.alertCtrl.create({
         

      title:'Confirmar Venta',
      message:"Desea finalizar venta?",
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
          this.insertarVenta();
          this.actualizarFolio();
          if(this.reconocimientoVta>0)  //si se utilizo reconocimiento en esta venta  se manda llamar la funcion que actualiza el valor de reconocimiento sobrante.
           {this.actualizarReconocimiento();}

          this.imprimirNotaVta()
            
          //DESCO
          
         // this.nav.setRoot("ClientesPage"); //regresa a la pagina de Clientes
           //regresa a la pagina de Inicio 
         // this.nav.popTo(this.nav.getByIndex(1)); //regresa a la pagina de clientes (2 paginas atras)
        }
        
      }
      ]
    });
    prompt.present();
  }


//-----Lilu
  ionViewDidLoad() {  //lo que hace al cargar la pagina|  

// Si la Hora, los Minutos o los Segundos son Menores o igual a 9, le añadimos un 0 */
if (this.Hora <= 9) 
{ this.h = "0" + this.Hora;}
else{ this.h =  this.Hora.toString();}

if (this.Minutos <= 9) 
{this.m = "0" + this.Minutos}
else{ this.m =  this.Minutos.toString();}

if (this.Segundos <= 9) 
{this.s= "0" + this.Segundos}
else{ this.s =  this.Segundos.toString();}

this.horaFinal=this.h+":"+this.m+":"+this.s
this.fechaHoraFinal= this.fechaActual.toLocaleDateString('en-GB')+" "+this.horaFinal;



    console.log("Entro a ticket");
   // console.log(this.cliente);
   // console.log(this.clavesVta);
   // console.log(this.tipoVentaCliente);
    this.obtenerRuta();
    this.obtenerFolio();
    this.buscarImpresora(); //Buscar impresora conectada por Bluetooth
  }

  obtenerRuta(){
    this.Storage.get('useremail').then((val) =>{
      this.rutamail = parseInt(val);
    })
  }

  buscarImpresora()
  {
    this.errorImpresion='N';
    this.printProvider.searchBt().then(datalist=>{
      
      //1. Open printer select modal
      let abc=this.modalCtrl.create(PrinterListModalPage,{data:datalist});
      
      //2. Printer selected, save into this.selectedPrinter
      abc.onDidDismiss(data=>{
        this.selectedPrinter=data;

      });
      this.errorImpresion='N';
      //0. Present Modal
      abc.present();

    },err=>{
      console.log("ERROR DE CONEXION: Reimprima mas tarde",err);
      let mno=this.alertCtrl.create({
        title:"La nota no puede ser impresa pero la venta se realizo correctamente ("+err+")",
        buttons:['Aceptar']
      });
      this.errorImpresion='S';
      mno.present();
    })

  }

  imprimirNotaVta()
  {
   if(this.errorImpresion!='S')
   {
    var id=this.selectedPrinter.id;
    if(id==null||id==""||id==undefined)
    {
      //nothing happens, you can put an alert here saying no printer selected
    }
    else
    {
      this.tipoImpresion='[ORIGINAL]';                // id es la direccion de la impresora conectada
      let foo=this.printProvider.ProveedorimpresionNotaVta(id,this.cliente, this.clavesVta,this.tipoVentaCliente, this.reconocimientoVta, this.subtotalVta,this.IVAVta, this.totalFinal,this.KLAcumVta, this.IEPSVta,   this.rutamail, this.tipoImpresion, this.ultimoFolio, this.vendedor, this.nomVendedor);  
      this.Storage.set('folio',this.ultimoFolio)
    //reimprimir nota infinita cantidad de veces hasta que seleccione No
    let alert = this.alertCtrl.create({
      title: 'Desea otra impresión de la venta?',
      buttons: [
          {
              text: 'SI',
              handler: () => {
                  alert.dismiss(true);
                 this.opcionReimprimir(id);
                  return false;
                  
              }
          }, {
              text: 'No',
              handler: () => {
                  alert.dismiss(false);
                  this.tipoTicket ='si'
                  this.nav.setRoot("HomePage",{tipoticket:this.tipoTicket});
                  return false;
                  
              }
          }
      ]
  });

  alert.present();

     }
    }
   
  }

  opcionReimprimir(id)
  {
    let alert = this.alertCtrl.create({
      title: 'Desea otra impresión de la venta?',
      buttons: [
          {
              text: 'SI',
              handler: () => {
                  alert.dismiss(true);
                this.tipoImpresion='[REIMPRESION]';
                
                  this.printProvider.ProveedorimpresionNotaVta(id,this.cliente, this.clavesVta,this.tipoVentaCliente, this.reconocimientoVta, this.subtotalVta,this.IVAVta, this.totalFinal,this.KLAcumVta, this.IEPSVta,   this.rutamail, this.tipoImpresion, this.ultimoFolio,  this.vendedor, this.nomVendedor)
                 this.opcionReimprimir(id);
                  return false;
                  
              }
          }, {
              text: 'No',
              handler: () => {
                 this.Storage.set('preventa', 'si');
                  alert.dismiss(false);
                  this.tipoTicket ='si';
                  this.nav.setRoot("HomePage",{tipoticket:this.tipoTicket})
                  return false;
                  
              }
          }
      ]
  });

  alert.present();{  

     }
    }




  obtenerFolio(){
     this.sqlite.create({
       name: 'ionicdb.db',
       location: 'default'
     }).then((db: SQLiteObject) => {

        this.consultaFolio = `select FLP_ULTIMO_FOLIO  FROM tb_hh_folioPre`               
        db.executeSql(this.consultaFolio,[]) // string de consulta,[ ] o[ x,x,x,x] segun los ?
        .then(res => {

          this.ultimoFolio=res.rows.item(0).FLP_ULTIMO_FOLIO
          console.log(this.ultimoFolio +'  folio anterior');  
          
         this.nuevoNumNota=parseInt(this.ultimoFolio.substring(6));
        
        //calcula el siguiente folio a utilizar sumandole 1+
         this.nuevoNumNota=this.nuevoNumNota+1;

         this.nuevoStrNota=this.nuevoNumNota.toString();

         // concatena los ceros necesarios para completar la cantidad de caracteres del ticket
         if(this.nuevoStrNota.length==1)
            { this.nuevoStrNota='00'+this.nuevoStrNota }

         if(this.nuevoStrNota.length==2)
            { this.nuevoStrNota='0'+this.nuevoStrNota }
         
           //concatena la parte fija (es fijo  los primeros 10 caracteres) y el valor que incremeta el folio en la nota de venta  (los ultimos 3 caracteres)
           this.ultimoFolio=this.ultimoFolio.substring(0,6)+this.nuevoStrNota;
           console.log(this.ultimoFolio +'  folio nuevo'); 
                
           }).catch(e => console.log(e));       
                 
         }).then(res =>{   
            
       })  

    }

    actualizarFolio()
    {
       this.sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {

         this.updateFol = `UPDATE tb_hh_folioPre SET FLP_ULTIMO_FOLIO= ?`
 
         db.executeSql(this.updateFol, [this.ultimoFolio])
         .catch(e => console.log(e));
           console.log('update de folio',this.ultimoFolio)   
           this.Storage.set('folio',this.ultimoFolio)
         
       })
      
    }


   insertarVenta()
    {
      try
      {  
      this.sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.db = db;

        console.log('variables' ,this.ultimoFolio, this.cliente.CL_CLIENTE, this.cliente.CL_PUNTOVENTA,this.cliente.CL_NOMNEGOCIO,this.fechaHoraFinal,this.rutamail, this.tipoVentaCliente, this.subtotalVta, this.IVAVta, this.IEPSVta, this.reconocimientoVta, this.totalFinal, this.cliente.CL_CORPORACION, 'ACTIVA', this.KLAcumVta,this.horaFinal);

         this.InsertaVta = `INSERT INTO tb_hh_nota_PreVenta (NPV_NOTA, NPV_CLIENTE, NPV_RAZON_SOCIAL, NPV_NOMBRE_CLIENTE, NPV_FECHA, NPV_RUTA, NPV_TIPO_VENTA, NPV_SUBTOTAL, NPV_IVA, NPV_IEPS, NPV_RECONOCIMIENTO, NPV_TOTAL, NPV_CORPO_CLIENTE, NPV_ESTATUS_NOTA, NPV_KILOLITROS_VENDIDOS, NPV_UPLOAD, NPV_HORA) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`

         db.executeSql(this.InsertaVta, [this.ultimoFolio, this.cliente.CL_CLIENTE, this.cliente.CL_PUNTOVENTA,this.cliente.CL_NOMNEGOCIO,this.fechaHoraFinal,this.rutamail, this.tipoVentaCliente, this.subtotalVta, this.IVAVta, this.IEPSVta, this.reconocimientoVta, this.totalFinal, this.cliente.CL_CORPORACION, 'ACTIVA', this.KLAcumVta, 0,this.horaFinal])
         .catch(e => console.log(e));    
       }).then(res =>{
        
        for (var p=0; p<this.clavesVta.length; p++){
          console.log(this.clavesVta.length)
   
        this.InsertaDetaVta = `INSERT INTO tb_hh_nota_PreVentaDetalle (DPN_FECHA, DPN_NOTA, DPN_CLAVE, DPN_DESCRIPCION, DPN_CANTIDAD_PIEZAS, DPN_PRECIO, DPN_IVA, DPN_IEPS, DPN_IMPORTE, DPN_UPLOAD) VALUES (?,?,?,?,?,?,?,?,?,?)`

        //|console.log('variables deta',this.fechaHoraFinal, this.ultimoFolio,this.clavesVta[p]['clave'],  this.clavesVta[p]['nombre'], this.clavesVta[p]['cantidad'], this.clavesVta[p]['precio'], this.clavesVta[p]['iva'], this.clavesVta[p]['ieps'], this.clavesVta[p]['importe']);

          this.db.executeSql(this.InsertaDetaVta,[this.fechaHoraFinal, this.ultimoFolio,this.clavesVta[p]['clave'],  this.clavesVta[p]['nombre'], this.clavesVta[p]['cantidad'], this.clavesVta[p]['precio'], this.clavesVta[p]['iva'], this.clavesVta[p]['ieps'], this.clavesVta[p]['importe'],0])
         .catch(e => console.log(e));
        }
       }
       )
      }
      catch
      { }
      
    }

    insertarDetalleVenta()
    {
      
        console.log('fuera for');

        for (var p=0; p<this.clavesVta.length; p++)
        {
        this.sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
        }).then((db: SQLiteObject) => {

        this.InsertaDetaVta = `INSERT INTO tb_hh_nota_PreVentaDetalle (DPN_FECHA, DPN_NOTA, DPN_CLAVE, DPN_DESCRIPCION, DPN_CANTIDAD_PIEZAS, DPN_PRECIO, DPN_IVA, DPN_IEPS, DPN_IMPORTE) VALUES (?,?,?,?,?,?,?,?,?)`

        console.log('variables deta',this.fechaHoraFinal, this.ultimoFolio,this.clavesVta[p]['clave'],  this.clavesVta[p]['nombre'], this.clavesVta[p]['cantidad'], this.clavesVta[p]['precio'], this.clavesVta[p]['iva'], this.clavesVta[p]['ieps'], this.clavesVta[p]['importe']);

         db.executeSql(this.InsertaDetaVta, [this.fechaHoraFinal, this.ultimoFolio,this.clavesVta[p]['clave'],  this.clavesVta[p]['nombre'], this.clavesVta[p]['cantidad'], this.clavesVta[p]['precio'], this.clavesVta[p]['iva'], this.clavesVta[p]['ieps'], this.clavesVta[p]['importe']])
         .catch(e => console.log(e));
         
        }) 
       } //cierre for
      }

      
     

     actualizarReconocimiento()
     {
       if(this.reconocimientoSobrante==0) // si el reconocimiento sobrante es 0 el arreglo se completara
       { this.reconocimientoCompleto='S';}
 
       if(this.reconocimientoSobrante>0)  //si el reconocimiento sobrante es mayor a cero aun tendra saldo pendiente
       {this.reconocimientoCompleto='N';}

      this.sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
       }).then((db: SQLiteObject) => {

         this.updateReconocimiento = `UPDATE tb_hh_arreglos SET AR_SALDO_PENDIENTE= ?, AR_COMPLETO=? WHERE AR_CLIENTE=? AND AR_RUTA=?`
 
         db.executeSql(this.updateReconocimiento, [this.reconocimientoSobrante, this.reconocimientoCompleto, this.cliente.CL_CLIENTE, this.rutamail])
         .catch(e => console.log(e));
      
         
       })
      
     }



}
