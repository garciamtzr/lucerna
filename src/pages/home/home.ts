import { Observable } from 'rxjs/Observable';
import { Component, ɵConsole } from '@angular/core';
import { IonicPage, NavController,ModalController,AlertController, NavParams,ToastController,  ViewController} from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import{Storage} from '@ionic/storage'
import {PrintProvider} from '../../providers/print/print';
import {PrinterListModalPage} from '../printer-list-modal/printer-list-modal';
import {NotaVentaProvider} from '../../providers/nota-venta/nota-venta'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { IfObservable } from 'rxjs/observable/IfObservable';
import 'rxjs/add/operator/catch';
import { OnlineProvider } from './../../providers/online/online';


//import { SqlUpProvider } from '../../providers/sql-up/sql-up'
//ultima modificacion 12/feb/2019 12:45 pm
declare var SqlServer: any;
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
 //19-02-2019 15:18
//  clientes = [];
  clientesSQL: any;//objeto para guardar los resultados de la consulta de clientes
  rutaNum;
  fechaHoraFinal


  selectedPrinter:any=[];
  db:SQLiteObject;

  notaCaptu:string;
  notaVtaSQL: any = [];
  notaVtaDetaSQL: any = [];
  
  tipoVentaCliente:String; //datos del total de la venta
  reconocimientoVta:number;
  subtotalVta:Number;
  IVAVta:Number;
  IEPSVta:Number;
  totalFinal:Number;
  KLAcumVta:Number;
  clienteNota:number;
  estatusNota:string;
  notaFolio:string;
  rutaNota:Number;
  vendedor:Number;
  nomVendedor: string;
  detalleVenta
  detallePreventa
  notaVenta1
  notaPreventa1
  tipoImpresion:string;
  tipoOperacion:string;
  updateEstatus:string; //para update

  //Variables para movimiento de inventarios
  claveCancel:number;
  updateSaldoInve:string; //para update

  errorImpresion:string;

  SaldoActual:number[]; //Saldo antes de agregar canceladas
  SaldoFinal:number[];  //Saldo despues de agregar canceladas

  //variables para movimiento de reconocimiento(arreglo)
  reconocimientoAntes:number;  //valor antes de cancelacion
  reconocimientoDespues:number; //valor despues de agregar monto cancelado
  updateReconocimiento:string;
  ReconocimientoCancel:number;
  tipoticket:string;
  sqlites:any = null;

  constructor(public navCtrl: NavController,private modalCtrl:ModalController,
    private printProvider:PrintProvider,  private view: ViewController,
    private alertCtrl:AlertController,
    public navParams: NavParams,  private toastCtrl: ToastController,
    public Storage:Storage,
    private sqlite: SQLite,
    public online:OnlineProvider,
  // private SqlUpProvider: SqlUpProvider,
    private notaVenta: NotaVentaProvider)  {
      SqlServer.init("201.174.70.186", "SQLSERVER", "sa", "TuLucernita2017", "SistemaComercial", function(event) {
       // alert(JSON.stringify(event));
        
      }, function(error) {
        alert(JSON.stringify(error));
      });
  

      // after 5 seconds stop
      //setTimeout(() => { clearInterval(timerId); alert('stop'); }, 5000);

     this.rutaNum= navParams.get('email');
   
     this.tipoticket =navParams.get('tipoticket')

  }



  ionViewDidLoad() 
  { 
    this.buscarImpresora(); //Buscar impresora conectada por Bluetooth desde que se abre la pagina para que este lista al imprimir

  }
  ionViewDidEnter(){
    console.log(this.tipoticket,'esta es preventa')
   /*
    SqlServer.testConnection(function(event) {
      alert(JSON.stringify(event));
    }, function(error) {
      alert("Error : " + JSON.stringify(error));
    });				
    */
   

    
    this.online.getStatus().subscribe(res =>{
      //console.log(res.result[0].estatus);
      if(res.result[0].estatus == "online"){
        if(this.tipoticket == 'si'){
          console.log('has hecho una preventa')
          this.subirPreSQL()
        }else{
          this.subirSQL()
        }
        
        
      }
      err => console.log(err, 'consolelog')
    })

    //this.subirSQL()
   
  }
    


  buscarImpresora()
  {
    this.errorImpresion='N';

    this.printProvider.searchBt().then(datalist=>{
      
      //1.Abre el modal de impresion
      let abc=this.modalCtrl.create(PrinterListModalPage,{data:datalist});
      
      //2. Llama a la impresora conectada default (solo debe haber una impresora vinculada porque tomara siempre la primera)
      abc.onDidDismiss(dataR=>{
        this.selectedPrinter=dataR;
      });
      this.errorImpresion='N'; //GUARDA LA N SI NO HAY ERROR
      //0. Present Modal
      abc.present();

    },err=>{
      console.log("ERROR DE CONEXION REVISE SU IMPRESORA",err);
      let mno=this.alertCtrl.create({
        title:"La nota no pudo ser impresa pero en caso de haber cancelado, la cancelación se realizó correctamente., ("+err+")",
        buttons:['Aceptar']
      });
      this.errorImpresion='S';
      mno.present();
    })

  }


  showPromptReimprimir(){   //ventana emergente para reimprimir nota
    const prompt = this.alertCtrl.create({
         
      title:'REIMPRESIONES',
      message:"Capture la nota que desea reimprimir:",
      inputs: [
        {
          name:'notaR',
          placeholder:'#'
       },
      ],
      buttons:[
        {
          text: 'Cerrar',
          handler: dataR =>{
         // console.log('Reimpre cancelado');
          }
      },
      {
        
        text:'Reimprimir',
        handler: dataR=>{
        this.notaCaptu=dataR.notaR;
        this.tipoOperacion='R';

          this.buscarNota();  
        }       
      }
      ]
    });
    prompt.present();
  }


  showPromptCancelar(){   //ventana emergente para reimprimir nota
    const prompt = this.alertCtrl.create({
         
      title:'CANCELACIONES',
      message:"Capture la nota que desea cancelar:",
      inputs: [
        {
          name:'notaC',
          placeholder:'#',
          //type:'number',
       },
      ],
      buttons:[
        {
          text: 'Cerrar',
          handler: dataR =>{
          //console.log('Reimpre cancelado');
          }
      },
      {
        
        text:'Cancelar Nota',
        handler: dataC=>{
          console.log(dataC.notaC, 'en el capture')
          this.notaCaptu=dataC.notaC;
          this.tipoOperacion='C';
         
          this.buscarNota();      
        }       
      }
      ]
    });
    prompt.present();
  }


  
  buscarNota()
  {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      
      //console.log(this.notaCaptu);

      this.notaVtaSQL = [];
      db.executeSql('SELECT NV_NOTA, NV_CLIENTE, NV_FECHA, NV_RUTA, NV_TIPO_VENTA, NV_SUBTOTAL, NV_IVA, NV_IEPS, NV_RECONOCIMIENTO, NV_TOTAL,NV_ESTATUS_NOTA, NV_KILOLITROS_VENDIDOS  FROM tb_hh_nota_venta WHERE NV_NOTA=?', [this.notaCaptu])
      .then(res => {

        //Variables del concentrado de la nota de venta.
            this.notaFolio=res.rows.item(0).NV_NOTA;
            this.clienteNota=res.rows.item(0).NV_CLIENTE;
            this.rutaNota=res.rows.item(0).NV_RUTA;
            this.tipoVentaCliente=res.rows.item(0).NV_TIPO_VENTA;
            this.subtotalVta=res.rows.item(0).NV_SUBTOTAL;
            this.IVAVta=res.rows.item(0).NV_IVA;
            this.IEPSVta=res.rows.item(0).NV_IEPS;
            this.reconocimientoVta=res.rows.item(0).NV_RECONOCIMIENTO;
            this.totalFinal=res.rows.item(0).NV_TOTAL;
            this.KLAcumVta=res.rows.item(0).NV_KILOLITROS_VENDIDOS;
            this.estatusNota=res.rows.item(0).NV_ESTATUS_NOTA;
  
       return console.log(this.clienteNota," noat que voy a dar cuello");
      }).then(res=>{
      
        if(this.estatusNota=='CANCELADA' && this.tipoOperacion=='C')
        {
          let toast = this.toastCtrl.create({ //muestra un mensaje tipo toast
            message:'La nota ingresada ya fue cancelada anteriormente.',
            duration: 4000,
            position:'top' 

          });
          toast.present();
        }
        else
        { this.buscarCliente();}

     })
   })
  }

  buscarCliente() //busca los datos del cliente de la nota para mandarlos a la funcion de reimpresion
  {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
 
   
      this.clientesSQL = [];
      //console.log(this.clienteNota);
      db.executeSql('SELECT CL_CLIENTE, CL_NOMNEGOCIO, CL_PUNTOVENTA, CL_RFC, CL_DIRNEGOCIO, CL_COLNEGOCIO, CL_CPCLIE, CL_CORPORACION , CL_CIUDADNEGOCIO FROM clientes WHERE CL_CLIENTE=?', [this.clienteNota])
      .then(res => {
    
          //ClienteSQL debe ser un objeto (no lleva push) ya que si se maneja como arreglo no lo puede leer la funcion de impresion
          this.clientesSQL={CL_CLIENTE:res.rows.item(0).CL_CLIENTE,CL_NOMNEGOCIO:res.rows.item(0).CL_NOMNEGOCIO,CL_CIUDADNEGOCIO:res.rows.item(0).CL_CIUDADNEGOCIO, CL_CPCLIE:res.rows.item(0).CL_CPCLIE,
            CL_PUNTOVENTA:res.rows.item(0).CL_PUNTOVENTA,CL_RFC:res.rows.item(0).CL_RFC,CL_DIRNEGOCIO:res.rows.item(0).CL_DIRNEGOCIO,
            CL_COLNEGOCIO:res.rows.item(0).CL_COLNEGOCIO, CL_CORPORACION:res.rows.item(0).CL_CORPORACION
            
        }
        return console.log(this.clientesSQL); 
          }).then(res=>{
          this.buscarDetalleNota();     
        })
      })
   }


   buscarFecha(){
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      this.notaVtaDetaSQL = [];
      db.executeSql('SELECT NV_HORA  FROM tb_hh_nota_venta WHERE NV_NOTA=?', [this.notaCaptu])
      .then(res => {
        for(var a=0; a<res.rows.length; a++) {
          this.fechaHoraFinal = res.rows.item(a).NV_HORA
         }
        
        console.log (this.fechaHoraFinal);
          })
   })
  }

  buscarDetalleNota() //guarda en un arreglo los productos que contiene la nota 
  {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      this.notaVtaDetaSQL = [];
      db.executeSql('SELECT DN_FECHA, DN_NOTA, DN_CLAVE, DN_DESCRIPCION, DN_CANTIDAD_PIEZAS, DN_PRECIO, DN_IVA, DN_IEPS, DN_IMPORTE  FROM tb_hh_nota_detalle WHERE DN_NOTA=?', [this.notaCaptu])
      .then(res => {
        for(var a=0; a<res.rows.length; a++) {
          this.notaVtaDetaSQL.push({fecha:res.rows.item(a).DN_FECHA, nota:res.rows.item(a).DN_NOTA, clave:res.rows.item(a).DN_CLAVE, nombre:res.rows.item(a).DN_DESCRIPCION,
           cantidad:res.rows.item(a).DN_CANTIDAD_PIEZAS, precio:res.rows.item(a).DN_PRECIO, iva:res.rows.item(a).DN_IVA,
            ieps:res.rows.item(a).DN_IEPS, importe:res.rows.item(a).DN_IMPORTE,
             })
         }
        
        console.log (this.notaVtaDetaSQL);
          }).then(res=>{

          if(this.tipoOperacion=='R') //si la operacion solo es reimprimir
            {this.ReimprimirNota();   }
            
          if(this.tipoOperacion=='C')  //si la opercion es cancelar llama a la funcion que busca y regresa al inventario
            { this.buscarInventario();}
            
      })
    })
  }
        
 
  ReimprimirNota()
  {
 if(this.errorImpresion!='S')  //si la impresora no esta en error
   {
    if(this.tipoOperacion=='R')  //so la operacion es reimprimir
     { 
      if(this.estatusNota=='ACTIVA')   //si la reimpresion es de una nota activa
       { this.tipoImpresion='[REIMPRESION-A]'; } 

      if(this.estatusNota=='CANCELADA') //si la reimpresion es de una nota cancelada
       { this.tipoImpresion='[REIMPRESION-C]'; }
     }

   if(this.tipoOperacion=='C')  //si la operacion es de cancelar la nota
   { 
      this.tipoImpresion='[CANCELACION]'; 
      this.reconocimientoVta=this.ReconocimientoCancel;
   } 

    var id=this.selectedPrinter.id;  //si no se encuentra ninguna impresora vinculada
    if(id==null||id==""||id==undefined)
    {
      //No hay alguna impresora seleccionada: la direccion sera nula, vacia o indefinida
       let toast = this.toastCtrl.create({ //muestra un mensaje tipo toast
        message:'El proceso se realizó correctamente, pero No se encontró la impresora vinculada o el Bluetooth esta apagado. Revise el equipo y reimprima su nota mas tarde.',
        duration: 6000,
        position:'top' 

      });
      toast.present();
    }
    else
    {             
                                                          // id es la direccion de la impresora conectada
      let foo=this.printProvider.ProveedorimpresionNotaVta(id,this.clientesSQL, this.notaVtaDetaSQL,this.tipoVentaCliente, this.reconocimientoVta, this.subtotalVta,this.IVAVta, this.totalFinal,this.KLAcumVta, this.IEPSVta,   this.rutaNota, this.tipoImpresion, this.notaFolio, this.vendedor, this.nomVendedor, this.fechaHoraFinal);  

    //reimprimir nota 2  veces o seleccione No
    let alert = this.alertCtrl.create({
      title: 'Desea otra impresión de la venta?',
      buttons: [
          {
              text: 'SI',
              handler: () => {
                  alert.dismiss(true);
                  let foo=this.printProvider.ProveedorimpresionNotaVta(id,this.clientesSQL, this.notaVtaDetaSQL,this.tipoVentaCliente, this.reconocimientoVta, this.subtotalVta,this.IVAVta, this.totalFinal,this.KLAcumVta, this.IEPSVta,   this.rutaNota, this.tipoImpresion, this.notaFolio, this.vendedor, this.nomVendedor, this.fechaHoraFinal);   
                  return false;
              }
          }, {
              text: 'No',
              handler: () => {
                  alert.dismiss(false);
                  return false;
              }
          }
      ]
   });

   alert.present(); 
    }
  }
}
  buscarInventario() //busca las claves en el inventario para conocer su existencia actual y guardarla en un arreglo
   {     
    this.sqlite.create({
    name: 'ionicdb.db',
    location: 'default'
  }).then((db: SQLiteObject) => {

   //this.SaldoActual = []; 
      for(var e =0; e<this.notaVtaDetaSQL.length; e++)
       {
         this.SaldoActual = []; 
        this.claveCancel=this.notaVtaDetaSQL[e]['clave'];
        db.executeSql('SELECT IN_CANTIDAD FROM tb_hh_inventario WHERE IN_CLAVE=?', [this.claveCancel])

       .then(res => {      
      
         this.SaldoActual.push(res.rows.item(0).IN_CANTIDAD) 
         console.log(this.SaldoActual.length, 'longitud saldo actual');
         console.log(this.SaldoActual, 'cantidad en inventario');
         this.sumarInventario();


         if(this.reconocimientoVta>0)   //si hay reconocimiento aplicado en la nota (debe regresarse tambien)
     {
       console.log("soy una nota con reconocimiento")
        this.consultarReconocimientoClie();}

     if(this.reconocimientoVta == 0)
     {
      console.log("no tengo reconocimiento") 
      this.CambiarEstatusCancelacion();}

          }).catch(e => console.log(e));      
       } 
     }).then(res =>{
     })
  

     
   
  }

  sumarInventario()  //suma las piezas canceladas al inventario actual
   {
    this.SaldoFinal =[]
    for(var p=0; p<this.SaldoActual.length; p++){
      //console.log("entra a for de suma cancel")
      this.SaldoFinal.push(this.SaldoActual[p] + this.notaVtaDetaSQL[p]['cantidad'])
      console.log(this.SaldoActual[p], '+', this.notaVtaDetaSQL[p]['cantidad'], " cantidades nuevas ", this.SaldoFinal)
    }

     this.sqlite.create({
       name: 'ionicdb.db',
       location: 'default'
     }).then((db: SQLiteObject) => {
      //console.log("update de saldo de ",this.SaldoFinal)

     // console.log(this.SaldoFinal)
      for(var i=0; i<this.SaldoFinal.length; i++)
        {
        this.updateSaldoInve = `UPDATE tb_hh_inventario SET IN_CANTIDAD = ? WHERE IN_CLAVE = ?`
        db.executeSql(this.updateSaldoInve, [this.SaldoFinal[i],this.notaVtaDetaSQL[i]['clave']])
        .catch(e => console.log(e));
          console.log('proceso termino update inventario');      
        }        
      })
    
   }

    consultarReconocimientoClie() //Busca el monto pendiente del arreglo y le suma el monto encontrado en la nota cancelada
    { 
      this.ReconocimientoCancel=this.reconocimientoVta;

      this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
      }).then((db: SQLiteObject) => {
       
      db.executeSql('SELECT AR_SALDO_PENDIENTE FROM tb_hh_arreglos WHERE AR_CLIENTE=?', [this.clienteNota])

     .then(res => {      
    
     return  this.reconocimientoAntes=res.rows.item(0).AR_SALDO_PENDIENTE;  //utilizar return para que entre al codigo del then       
      
        }).then(res =>{     //el then debe estar justo debajo del return     

          this.reconocimientoDespues=this.reconocimientoAntes+this.ReconocimientoCancel;
          console.log(this.reconocimientoAntes,'+',this.ReconocimientoCancel,'=',this.reconocimientoDespues ,' reconocimiento final');

         this.updateReconocimiento = 'UPDATE tb_hh_arreglos SET AR_SALDO_PENDIENTE = ? WHERE AR_CLIENTE=?'
         db.executeSql(this.updateReconocimiento, [this.reconocimientoDespues,this.clienteNota])
       
         .catch(e => console.log(e));
          console.log('se actualizo el arreglo cliente ',this.clienteNota, 'por ',this.reconocimientoDespues);

          
    }).catch(e => console.log(e));      
       
         })
         this.CambiarEstatusCancelacion() //Manda llamar la funcion de cambio de estatus a Cancelada y la impresion de la nota
  }

   CambiarEstatusCancelacion()
   {  //Actualiza el estatus de la nota cuando es cancelada 
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
      }).then((db: SQLiteObject) => {
        console.log(this.notaCaptu, "nota a cancelar")
       this.updateEstatus = `UPDATE tb_hh_nota_venta SET NV_ESTATUS_NOTA='CANCELADA' WHERE NV_NOTA=?`

       db.executeSql(this.updateEstatus, [this.notaCaptu])
       .catch(e => console.log(e));
         console.log('update de cancel',this.notaCaptu)  
        }).then(res=>{

              this.ReimprimirNota();
        })

        SqlServer.execute("UPDATE TB_HH_NOTA_VENTA SET  NV_ESTATUS_NOTA ='CANCELADA' WHERE NV_NOTA ='"+this.notaCaptu+"'", function(event) {    
 
          alert("Update complete : " + JSON.stringify(event));
         
        }, function(error) {
          alert("Error : " + JSON.stringify(error + "error este cabron"));
        });
    
  }

  carritoVentas(event, cliente){
    this.navCtrl.push("CarritoVtPage",{
      cliente: cliente
    });   
  }

  subirSQL(){
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
}).then((db: SQLiteObject) => {
  var sqlquery = `SELECT * FROM tb_hh_nota_venta WHERE NV_UPLOAD = 0`
  return db.executeSql(sqlquery,[])
  }).then(res =>{
  //  console.log(res.rows.length)
    if(res.rows.length >0){
      this.notaVenta1 =[];
      for(var i=0; i<res.rows.length; i++){
        this.notaVenta1.push({
          NV_NOTA:res.rows.item(i).NV_NOTA,
          NV_CLIENTE: res.rows.item(i).NV_CLIENTE,
          NV_RAZON_SOCIAL: res.rows.item(i).NV_RAZON_SOCIAL,
          NV_NOMBRE_CLIENTE: res.rows.item(i).NV_NOMBRE_CLIENTE,
          NV_FECHA: res.rows.item(i).NV_FECHA,
          NV_RUTA: res.rows.item(i).NV_RUTA,
          NV_TIPO_VENTA: res.rows.item(i).NV_TIPO_VENTA,
          NV_SUBTOTAL: res.rows.item(i).NV_SUBTOTAL,
          NV_IVA: res.rows.item(i).NV_IVA,
          NV_IEPS: res.rows.item(i).NV_IEPS,
          NV_RECONOCIMIENTO: res.rows.item(i).NV_RECONOCIMIENTO,
          NV_TOTAL: res.rows.item(i).NV_TOTAL,
          NV_CORPO_CLIENTE: res.rows.item(i).NV_CORPO_CLIENTE,
          NV_ESTATUS_NOTA: res.rows.item(i).NV_ESTATUS_NOTA,
          NV_KILOLITROS_VENDIDOS: res.rows.item(i).NV_KILOLITROS_VENDIDOS,
          NV_UPLOAD: res.rows.item(i).NV_UPLOAD,
          NV_HORA:res.rows.item(i).NV_HORA
        })
        
        
          console.log(this.notaVenta1,'info vta')
        
          

           //this.insertDetalleSQL()
               
        
        }
        if (res.rows.length == this.notaVenta1.length){
          return this.notaVenta1
        }

  }else{
    console.log('no hay shiet')
  }
  }).then((db: SQLiteObject) =>{
    this.db = db;
    console.log(this.notaVenta1,'el then al final')
    for(var e=0; e<this.notaVenta1.length; e++){
      console.log('dentro del for insert')
  SqlServer.execute("INSERT INTO TB_HH_NOTA_VENTA (NV_NOTA, NV_CLIENTE ,NV_RAZON_SOCIAL ,NV_NOMBRE_CLIENTE ,NV_FECHA,NV_RUTA,NV_TIPO_VENTA,NV_SUBTOTAL,NV_IVA,NV_IEPS,NV_RECONOCIMIENTO,NV_TOTAL ,NV_CORPO_CLIENTE,NV_ESTATUS_NOTA,NV_KILOLITROS_VENDIDOS ,NV_UPLOAD, NV_HORA)  VALUES('"+this.notaVenta1[e]["NV_NOTA"]+"',"+this.notaVenta1[e]["NV_CLIENTE"]+",'"+this.notaVenta1[e]["NV_RAZON_SOCIAL"]+"','"+this.notaVenta1[e]["NV_NOMBRE_CLIENTE"]+"','"+this.notaVenta1[e]["NV_FECHA"]+"',"+this.notaVenta1[e]["NV_RUTA"]+",'"+this.notaVenta1[e]["NV_TIPO_VENTA"]+"',"+this.notaVenta1[e]["NV_SUBTOTAL"]+","+this.notaVenta1[e]["NV_IVA"]+","+this.notaVenta1[e]["NV_IEPS"]+","+this.notaVenta1[e]["NV_RECONOCIMIENTO"]+","+this.notaVenta1[e]["NV_TOTAL"]+","+this.notaVenta1[e]["NV_CORPO_CLIENTE"]+",'"+this.notaVenta1[e]["NV_ESTATUS_NOTA"]+"',"+this.notaVenta1[e]["NV_KILOLITROS_VENDIDOS"]+","+this.notaVenta1[e]["NV_UPLOAD"]+",'"+this.notaVenta1[e]["NV_HORA"]+"')", function(event) {    
   
     // alert("Update complete : " + JSON.stringify(event));
     
    }, function(error) {
      alert("Error : " + JSON.stringify(error));
    });
    //this.updateNV()
    
  }
  this.updateNV()
  

  
  
  })
}



updateNV(){
  this.sqlite.create({
    name: 'ionicdb.db',
    location: 'default'
}).then((db: SQLiteObject) => {
  for(var e=0;e<this.notaVenta1.length; e++){
  var sqlquery2 ='UPDATE tb_hh_nota_venta SET  NV_UPLOAD = 1 WHERE NV_NOTA =?'
  db.executeSql(sqlquery2, [this.notaVenta1[e]["NV_NOTA"]])
  }
  this.insertDetalleSQL()
})
}

  insertDetalleSQL(){
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
}).then((db: SQLiteObject) => {
  console.log("hey oh!")
   // console.log(this.notaVenta1[e]['NV_NOTA'])
    var sqlquery2 = "SELECT * FROM tb_hh_nota_detalle where DN_UPLOAD = 0"
    return db.executeSql(sqlquery2,[])
    
}).then(res =>{
     // console.log(res.rows.item(0).DN_NOTA)
      this.detalleVenta =[]
      for(var i=0; i<res.rows.length; i++){
        this.detalleVenta.push({
          DN_FECHA:res.rows.item(i).DN_FECHA,
          DN_NOTA:res.rows.item(i).DN_NOTA,
          DN_CLAVE:res.rows.item(i).DN_CLAVE,
          DN_DESCRIPCION:res.rows.item(i).DN_DESCRIPCION,
          DN_CANTIDAD_PIEZAS:res.rows.item(i).DN_CANTIDAD_PIEZAS,
          DN_PRECIO:res.rows.item(i).DN_PRECIO,
          DN_IVA:res.rows.item(i).DN_IVA,
          DN_IEPS:res.rows.item(i).DN_IEPS,
          DN_IMPORTE:res.rows.item(i).DN_IMPORTE,
          DN_UPLOAD:res.rows.item(i).DN_UPLOAD
        })
      } 
      if(res.rows.length == this.detalleVenta.length){
        console.log(this.detalleVenta,'regresa detalle de venta')
        return this.detalleVenta;
      }
    })
     .then(res =>{
        
        for(var f=0; f<this.detalleVenta.length; f++){
          console.log(this.detalleVenta,'detalle vta')
        SqlServer.execute("INSERT INTO TB_HH_NOTA_DETALLE (DN_FECHA,DN_NOTA ,DN_CLAVE,DN_DESCRIPCION,DN_CANTIDAD_PIEZAS,DN_PRECIO,DN_IVA,DN_IEPS,DN_IMPORTE,DN_UPLOAD) VALUES('"+this.detalleVenta[f]["DN_FECHA"]+"','"+this.detalleVenta[f]["DN_NOTA"]+"',"+this.detalleVenta[f]["DN_CLAVE"]+",'"+this.detalleVenta[f]["DN_DESCRIPCION"]+"',"+this.detalleVenta[f]["DN_CANTIDAD_PIEZAS"]+","+this.detalleVenta[f]["DN_PRECIO"]+","+this.detalleVenta[f]["DN_IVA"]+","+this.detalleVenta[f]["DN_IEPS"]+","+this.detalleVenta[f]["DN_IMPORTE"]+","+this.detalleVenta[f]["DN_UPLOAD"]+")", function(event) {    
   
          alert("Detalle de venta guardado correctamente : " + JSON.stringify(event));
         
        }, function(error) {
          alert("Error : " + JSON.stringify(error));
        });
        
        }
        this.updateDN()
        
  })
     
}

updateDN(){
  this.sqlite.create({
    name: 'ionicdb.db',
    location: 'default'
}).then((db: SQLiteObject) => {
  console.log("llega a update del detalle upload")
  for(var e=0;e<this.detalleVenta.length; e++){
    var sqlupdate = `UPDATE tb_hh_nota_detalle SET DN_UPLOAD = 1 WHERE DN_NOTA = ?`
    db.executeSql(sqlupdate,[this.detalleVenta[e]['DN_NOTA']])
  }
  
})

}

/************Preventa CODIGO DEL DIABLO LESBIANO****************** */
subirPreSQL(){
  this.sqlite.create({
    name: 'ionicdb.db',
    location: 'default'
}).then((db: SQLiteObject) => {
var sqlquery = `SELECT * FROM tb_hh_nota_PreVenta WHERE NPV_UPLOAD = 0`
return db.executeSql(sqlquery,[])
}).then(res =>{
//  console.log(res.rows.length)
  if(res.rows.length >0){
    this.notaPreventa1 =[];
    for(var i=0; i<res.rows.length; i++){
      this.notaPreventa1.push({
        NPV_NOTA:res.rows.item(i).NPV_NOTA,
        NPV_CLIENTE: res.rows.item(i).NPV_CLIENTE,
        NPV_RAZON_SOCIAL: res.rows.item(i).NPV_RAZON_SOCIAL,
        NPV_NOMBRE_CLIENTE: res.rows.item(i).NPV_NOMBRE_CLIENTE,
        NPV_FECHA: res.rows.item(i).NPV_FECHA,
        NPV_RUTA: res.rows.item(i).NPV_RUTA,
        NPV_TIPO_VENTA: res.rows.item(i).NPV_TIPO_VENTA,
        NPV_SUBTOTAL: res.rows.item(i).NPV_SUBTOTAL,
        NPV_IVA: res.rows.item(i).NPV_IVA,
        NPV_IEPS: res.rows.item(i).NPV_IEPS,
        NPV_RECONOCIMIENTO: res.rows.item(i).NPV_RECONOCIMIENTO,
        NPV_TOTAL: res.rows.item(i).NPV_TOTAL,
        NPV_CORPO_CLIENTE: res.rows.item(i).NPV_CORPO_CLIENTE,
        NPV_ESTATUS_NOTA: res.rows.item(i).NPV_ESTATUS_NOTA,
        NPV_KILOLITROS_VENDIDOS: res.rows.item(i).NPV_KILOLITROS_VENDIDOS,
        NPV_UPLOAD: res.rows.item(i).NPV_UPLOAD,
        NPV_HORA: res.rows.item(i).NPV_HORA
      })
      
      
        console.log(this.notaPreventa1,'info vta')
      
        

         //this.insertDetalleSQL()
             
      
      }
      if (res.rows.length == this.notaPreventa1.length){
        return this.notaPreventa1
      }

}else{
  console.log('no hay shiet')
}
}).then((db: SQLiteObject) =>{
  this.db = db;
  console.log(this.notaPreventa1,'el then al final')
  for(var e=0; e<this.notaPreventa1.length; e++){
    console.log('dentro del for insert')
SqlServer.execute("INSERT INTO TB_HH_NOTA_PREVENTA (NPV_NOTA, NPV_CLIENTE ,NPV_RAZON_SOCIAL ,NPV_NOMBRE_CLIENTE ,NPV_FECHA,NPV_RUTA,NPV_TIPO_VENTA,NPV_SUBTOTAL,NPV_IVA,NPV_IEPS,NPV_RECONOCIMIENTO,NPV_TOTAL ,NPV_CORPO_CLIENTE,NPV_ESTATUS_NOTA,NPV_KILOLITROS_VENDIDOS ,NPV_UPLOAD, NPV_HORA)  VALUES('"+this.notaPreventa1[e]["NPV_NOTA"]+"',"+this.notaPreventa1[e]["NPV_CLIENTE"]+",'"+this.notaPreventa1[e]["NPV_RAZON_SOCIAL"]+"','"+this.notaPreventa1[e]["NPV_NOMBRE_CLIENTE"]+"','"+this.notaPreventa1[e]["NPV_FECHA"]+"',"+this.notaPreventa1[e]["NPV_RUTA"]+",'"+this.notaPreventa1[e]["NPV_TIPO_VENTA"]+"',"+this.notaPreventa1[e]["NPV_SUBTOTAL"]+","+this.notaPreventa1[e]["NPV_IVA"]+","+this.notaPreventa1[e]["NPV_IEPS"]+","+this.notaPreventa1[e]["NPV_RECONOCIMIENTO"]+","+this.notaPreventa1[e]["NPV_TOTAL"]+","+this.notaPreventa1[e]["NPV_CORPO_CLIENTE"]+",'"+this.notaPreventa1[e]["NPV_ESTATUS_NOTA"]+"',"+this.notaPreventa1[e]["NPV_KILOLITROS_VENDIDOS"]+","+this.notaPreventa1[e]["NPV_UPLOAD"]+",'"+this.notaPreventa1[e]["NPV_HORA"]+"')", function(event) {    
 
    alert("Update complete : " + JSON.stringify(event));
   
  }, function(error) {
    alert("Error : " + JSON.stringify(error));
  });
  //this.updateNV()
  
}
this.updateNPV()
})
}



updateNPV(){
this.sqlite.create({
  name: 'ionicdb.db',
  location: 'default'
}).then((db: SQLiteObject) => {
for(var e=0;e<this.notaPreventa1.length; e++){
var sqlquery2 ='UPDATE tb_hh_nota_PreVenta SET  NPV_UPLOAD = 1 WHERE NPV_NOTA =?'
db.executeSql(sqlquery2, [this.notaPreventa1[e]["NPV_NOTA"]])
}
this.insertPreDetalleSQL()
})
}

insertPreDetalleSQL(){
  this.sqlite.create({
    name: 'ionicdb.db',
    location: 'default'
}).then((db: SQLiteObject) => {
console.log("hey oh!")
 // console.log(this.notaVenta1[e]['NV_NOTA'])
  var sqlquery2 = "SELECT * FROM tb_hh_nota_PreVentaDetalle WHERE DPN_UPLOAD = 0"
  return db.executeSql(sqlquery2,[])
  
}).then(res =>{
   // console.log(res.rows.item(0).DN_NOTA)
    this.detallePreventa =[]
    for(var i=0; i<res.rows.length; i++){
      this.detallePreventa.push({
        DPN_FECHA:res.rows.item(i).DPN_FECHA,
        DPN_NOTA:res.rows.item(i).DPN_NOTA,
        DPN_CLAVE:res.rows.item(i).DPN_CLAVE,
        DPN_DESCRIPCION:res.rows.item(i).DPN_DESCRIPCION,
        DPN_CANTIDAD_PIEZAS:res.rows.item(i).DPN_CANTIDAD_PIEZAS,
        DPN_PRECIO:res.rows.item(i).DPN_PRECIO,
        DPN_IVA:res.rows.item(i).DPN_IVA,
        DPN_IEPS:res.rows.item(i).DPN_IEPS,
        DPN_IMPORTE:res.rows.item(i).DPN_IMPORTE,
        DPN_UPLOAD:res.rows.item(i).DPN_UPLOAD
      })
    } 
    if(res.rows.length == this.detallePreventa.length){
      console.log(this.detallePreventa,'regresa detalle de venta')
      return this.detallePreventa;
    }
  })
   .then(res =>{
      
      for(var f=0; f<this.detallePreventa.length; f++){
        console.log(this.detallePreventa,'detalle vta')
      SqlServer.execute("INSERT INTO TB_HH_NOTA_PREVENTADETALLE (DPN_FECHA,DPN_NOTA ,DPN_CLAVE,DPN_DESCRIPCION,DPN_CANTIDAD_PIEZAS,DPN_PRECIO,DPN_IVA,DPN_IEPS,DPN_IMPORTE,DPN_UPLOAD) VALUES('"+this.detallePreventa[f]["DPN_FECHA"]+"','"+this.detallePreventa[f]["DPN_NOTA"]+"',"+this.detallePreventa[f]["DPN_CLAVE"]+",'"+this.detallePreventa[f]["DPN_DESCRIPCION"]+"',"+this.detallePreventa[f]["DPN_CANTIDAD_PIEZAS"]+","+this.detallePreventa[f]["DPN_PRECIO"]+","+this.detallePreventa[f]["DPN_IVA"]+","+this.detallePreventa[f]["DPN_IEPS"]+","+this.detallePreventa[f]["DPN_IMPORTE"]+","+this.detallePreventa[f]["DPN_UPLOAD"]+")", function(event) {    
 
        //alert("Update complete detalle : " + JSON.stringify(event));
       
      }, function(error) {
        alert("Error : " + JSON.stringify(error));
      });
      
      }
      this.updateDPN()
      
})
   
}

updateDPN(){
this.sqlite.create({
  name: 'ionicdb.db',
  location: 'default'
}).then((db: SQLiteObject) => {
console.log("llega a update del detalle upload")
for(var e=0;e<this.detallePreventa.length; e++){
  var sqlupdate = `UPDATE tb_hh_nota_PreVentaDetalle SET DPN_UPLOAD = 1 WHERE DPN_NOTA = ?`
  db.executeSql(sqlupdate,[this.detallePreventa[e]['DPN_NOTA']])
}

})

}

inventario(){
  this.navCtrl.push("InventarioPage");
}

/***************************************************************** */

}
