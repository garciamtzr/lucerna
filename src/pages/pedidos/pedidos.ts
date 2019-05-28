import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController,LoadingController, ViewController, AlertController } from 'ionic-angular';
import { PedidosProvider } from './../../providers/pedidos/pedidos';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the PedidosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var sqlite3: any;
@IonicPage()
@Component({
  selector: 'page-pedidos',
  templateUrl: 'pedidos.html',
})
export class PedidosPage {
  
  pedidos = [];
  rutamail: any;
  pedidosFiltrados: any;
  inventario
  inventarioAct =[]
  suma
  LimpiarPedidos
  

  fechaActual=new Date();
  fechaHoraFinal:string;
  folioIni='';
 // let db = new sqlite3.Database('../db/chinook.db');


  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private pedido:PedidosProvider,
     public sqlite: SQLite,
     private alertCtrl: AlertController,
     private Storage: Storage
     ) {
      this.obtenerRuta()
      this.pedido.getPedidos().subscribe(res =>{
        console.log(res)
        this.pedidos = res.result;
        this.bajarPedido();}
        );
      console.log('ionViewDidLoad PedidosPage');
      console.log(this.fechaHoraFinal)
        this.fechaHoraFinal= this.fechaActual.toISOString().substr(0, 10);

        

  }

  ionViewDidLoad() {
    
    
  }

  ionViewDidEnter(){
    
   
  }

  obtenerRuta(){
    this.Storage.get('useremail').then((val) =>{
      this.rutamail = parseInt(val);
      console.log(this.rutamail)
    })
  }
   
  bajarPedido(){
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => { 

    db.executeSql('CREATE TABLE IF NOT EXISTS tb_hh_pedidos(PE_FECHA DATE, PE_NUMERO INT, PE_RUTA INT, PE_CLIENTE INT, PE_CLAVE INT, PE_DESCRIPCION TEXT, PE_CONVERSION_PZ REAL, PE_ESTATUS TEXT)',[])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e)); 

    console.log(this.pedidos, 'arreglo pedidos');
                     for(var i = 0; i<this.pedidos.length; i++){
                      var PE_FECHA = this.pedidos[i].PE_FECHA;
                      var PE_NUMERO = this.pedidos[i].PE_NUMERO;
                      var PE_RUTA = this.pedidos[i].PE_RUTA;
                      var PE_CLIENTE = this.pedidos[i].PE_CLIENTE;
                      var PE_CLAVE = this.pedidos[i].PE_CLAVE;
                      var PE_DESCRIPCION = this.pedidos[i].PE_DESCRIPCION;
                      var PE_CONVERSION_PZ = this.pedidos[i].PE_CONVERSION_PZ;
                      var PE_ESTATUS = this.pedidos[i].PE_ESTATUS;
                      var query13 = "INSERT INTO tb_hh_pedidos(PE_FECHA,PE_NUMERO, PE_RUTA, PE_CLIENTE, PE_CLAVE, PE_DESCRIPCION, PE_CONVERSION_PZ, PE_ESTATUS) VALUES (?,?,?,?,?,?,?,?)";
                      db.executeSql(query13, [PE_FECHA, PE_NUMERO, PE_RUTA,PE_CLIENTE, PE_CLAVE,PE_DESCRIPCION,PE_CONVERSION_PZ,PE_ESTATUS]).then(function(res) {
                      }, function (err) {
                        console.error(err);
                      });
                    }
                    this.filtratPedido();
  })
}

filtratPedido(){
  this.sqlite.create({
    name: 'ionicdb.db',
      location: 'default'
  }).then((db:SQLiteObject) =>{
     var quer1 = `SELECT * FROM tb_hh_pedidos WHERE PE_RUTA =?`
   return  db.executeSql(quer1,[this.rutamail])
  }).then(res =>{
    this.pedidosFiltrados = [];
    console.log(res.rows.length)
    for(var i=0; i<res.rows.length; i++) {
      this.pedidosFiltrados.push({PE_FECHA:res.rows.item(i).PE_FECHA, PE_NUMERO:res.rows.item(i).PE_NUMERO,
        PE_RUTA:res.rows.item(i).PE_RUTA,PE_CLAVE:res.rows.item(i).PE_CLAVE,PE_DESCRIPCION:res.rows.item(i).PE_DESCRIPCION,PE_CONVERSION_PZ:res.rows.item(i).PE_CONVERSION_PZ,PE_ESTATUS:res.rows.item(i).PE_ESTATUS})
    }

    console.log(this.pedidosFiltrados, "resultado")
    console.log(this.pedidosFiltrados[0].PE_CONVERSION_PZ)
  })
}


showPrompt(){   //ventana emergente para agregar cantidad de piezas
     
    
  const prompt = this.alertCtrl.create({
       

    title:'Confirmar Pedido',
    message:"Esta bien tu pedido?",
    buttons:[
      {
        text: 'No',
        handler: data =>{
          console.log('cancelado');
          this.limpiarTabla()
        }
    },
    {
      
      text:'Si',
      handler: data=>{
        this.actualizarPedido();
     

      }

 
    }
   
    ]
  });
  prompt.present();
}

actualizarPedido(){
  this.sqlite.create({
    name: 'ionicdb.db',
      location: 'default'
  }).then((db:SQLiteObject) =>{
    console.log(this.pedidosFiltrados.length)
    this.inventario=[]
    for(var i =0; i<this.pedidosFiltrados.length; i++){
    var query2 = `SELECT IN_CANTIDAD FROM tb_hh_inventario WHERE IN_CLAVE =?`
    db.executeSql(query2,[this.pedidosFiltrados[i].PE_CLAVE])
    .then(res =>{

      for(var i=0; i<res.rows.length; i++) {
        this.inventario.push({
          IN_CANTIDAD:res.rows.item(i).IN_CANTIDAD
        })
        console.log(this.inventario, "for en el primer then")

        if(this.inventario.length == this.pedidosFiltrados.length){
          for(var i = 0; i<this.inventario.length; i++){
            console.log(this.inventario[i].IN_CANTIDAD)
            console.log(this.pedidosFiltrados[i].PE_CLAVE)
            this.suma =0
            this.suma = this.inventario[i].IN_CANTIDAD + this.pedidosFiltrados[i].PE_CONVERSION_PZ
            console.log(this.suma)
            this.inventarioAct.push({IN_CANTIDAD:this.suma})
          }
          console.log(this.inventarioAct)
          return this.inventarioAct
        }
      }
  }).then(() =>{
    for(var i =0; i<this.pedidosFiltrados.length; i++){
      console.log(this.inventarioAct,"en el for final")
      var quer1 = `UPDATE tb_hh_inventario SET IN_CANTIDAD= ? WHERE IN_CLAVE =?`
      db.executeSql(quer1,[this.inventarioAct[i].IN_CANTIDAD,this.pedidosFiltrados[i].PE_CLAVE]).then(res =>{
        console.log(res,"update de base de datos termianda")
        this.LimpiarPedidos = 'DROP TABLE tb_hh_pedidos'
      db.executeSql(this.LimpiarPedidos,[]).then(() =>{
        this.navCtrl.setRoot("HomePage");
      })
      })
    }
  })
    }   
  })
  
  
  
}

limpiarTabla(){
  this.sqlite.create({
    name: 'ionicdb.db',
      location: 'default'
  }).then((db:SQLiteObject) =>{
    this.LimpiarPedidos = 'DROP TABLE tb_hh_pedidos'
    db.executeSql(this.LimpiarPedidos,[]).then(() =>{
      this.navCtrl.setRoot("HomePage");
    })
  })
}


  
}

