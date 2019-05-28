import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController,LoadingController, ViewController, AlertController } from 'ionic-angular';
import { PedidosProvider } from './../../providers/pedidos/pedidos';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Storage } from '@ionic/storage';
import { TraspasoProvider } from './../../providers/traspaso/traspaso';

/**
 * Generated class for the TraspasosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-traspasos',
  templateUrl: 'traspasos.html',
})
export class TraspasosPage {

  traspasos = [];
  rutamail: any;
  traspasosFiltrados: any;
  inventario
  inventarioAct =[]
  suma
  resta
  Limpiartraspasos
  db:SQLiteObject;

  fechaActual=new Date();
  fechaHoraFinal:string;
  folioIni='';
 // let db = new sqlite3.Database('../db/chinook.db');


  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private traspaso:TraspasoProvider,
     public sqlite: SQLite,
     private alertCtrl: AlertController,
     private toastCtrl: ToastController,
     private Storage: Storage
     ) {
      this.obtenerRuta()
      this.traspaso.getTraspaso().subscribe(res =>{
        console.log(res)
        this.traspasos = res.result;
        this.bajarPedido();}
        );
      console.log('ionViewDidLoad traspasosPage');
      console.log(this.fechaHoraFinal)
        this.fechaHoraFinal= this.fechaActual.toISOString().substr(0, 10);

        

  }
/*
  doRefresh(event) {
    console.log('Begin async operation');
    this.filtratPedido();
    event.target.complete();
  }
  */

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

    db.executeSql('CREATE TABLE IF NOT EXISTS tb_hh_traspaso(TR_FECHA DATE, TR_RUTA INT, TR_CLAVE INT, TR_CONVERSION_PZ INT, TR_TIPO TEXT)',[])
      .then(res => console.log('Executed SQL tabla creada'))
      .catch(e => console.log(e)); 

    console.log(this.traspasos, 'arreglo traspasos');
                     for(var i = 0; i<this.traspasos.length; i++){

                      //if(this.traspasos[i].TR_RUTA === this.rutamail){
                        console.log("si funcionation")
                      var TR_FECHA = this.traspasos[i].TR_FECHA;
                      var TR_RUTA = this.traspasos[i].TR_RUTA;
                      var TR_CLAVE = this.traspasos[i].TR_CLAVE;
                      var TR_CONVERSION_PZ = this.traspasos[i].TR_CONVERSION_PZ;
                      var TR_TIPO = this.traspasos[i].TR_TIPO;
                      
                      var query13 = "INSERT INTO tb_hh_traspaso(TR_FECHA, TR_RUTA, TR_CLAVE, TR_CONVERSION_PZ, TR_TIPO) VALUES (?,?,?,?,?)";
                      db.executeSql(query13, [TR_FECHA, TR_RUTA, TR_CLAVE, TR_CONVERSION_PZ, TR_TIPO]).then(function(res) {
                      }, function (err) {
                        console.error(err);
                      });
                     // }
                      
                    }
                    this.filtratPedido();
  })
}

filtratPedido(){
  this.sqlite.create({
    name: 'ionicdb.db',
      location: 'default'
  }).then((db:SQLiteObject) =>{
     var quer1 = `SELECT * FROM tb_hh_traspaso WHERE TR_RUTA =?`
   return  db.executeSql(quer1,[this.rutamail])
  }).then(res =>{
    this.traspasosFiltrados = [];
    console.log(res.rows.length)
    for(var i=0; i<res.rows.length; i++) {
      this.traspasosFiltrados.push({TR_FECHA:res.rows.item(i).TR_FECHA, TR_RUTA:res.rows.item(i).TR_RUTA,
        TR_CLAVE:res.rows.item(i).TR_CLAVE,TR_CONVERSION_PZ:res.rows.item(i).TR_CONVERSION_PZ,TR_TIPO:res.rows.item(i).TR_TIPO})
    }

    console.log(this.traspasosFiltrados, "resultado")
    console.log(this.traspasosFiltrados[0].TR_CONVERSION_PZ, "piezas")
  }).then(res => {

  
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
    console.log(this.traspasosFiltrados.length)
    this.inventario=[]
    for(var i =0; i<this.traspasosFiltrados.length; i++){
    var query2 = `SELECT IN_CANTIDAD FROM tb_hh_inventario WHERE IN_CLAVE =?`
    db.executeSql(query2,[this.traspasosFiltrados[i].TR_CLAVE])
    .then(res =>{

      for(var i=0; i<res.rows.length; i++) {
        this.inventario.push({
          IN_CANTIDAD:res.rows.item(i).IN_CANTIDAD
        })
        console.log(this.inventario, "for en el primer then")

        if(this.inventario.length == this.traspasosFiltrados.length){
          for(var i = 0; i<this.inventario.length; i++){
            console.log(this.inventario[i].IN_CANTIDAD)
            console.log(this.traspasosFiltrados[i].TR_CLAVE)
            if(this.traspasosFiltrados[i].TR_TIPO === 'R'){
              this.suma =0
              this.suma = this.inventario[i].IN_CANTIDAD + this.traspasosFiltrados[i].TR_CONVERSION_PZ
              console.log(this.suma)
              this.inventarioAct.push({IN_CANTIDAD:this.suma})
              console.log(this.inventarioAct)
            return this.inventarioAct
            }else{
              this.resta =0
              this.resta = this.inventario[i].IN_CANTIDAD - this.traspasosFiltrados[i].TR_CONVERSION_PZ
              console.log(this.resta)
              if(this.resta <0){

                let toast = this.toastCtrl.create({ //muestra un mensaje tipo toast
                  message:'No tienes suficiente Inventario.',
                  duration: 4000,
                  position:'top' 
      
                });
                toast.present();
                this.inventarioAct = this.inventario[0].IN_CANTIDAD
                console.log(this.inventarioAct)
                return this.inventarioAct
              }else{
                this.inventarioAct.push({IN_CANTIDAD:this.resta})
              console.log(this.inventarioAct)
            return this.inventarioAct
              }
              
            }

          }
          
        }
      }
  }).then(() =>{
    for(var i =0; i<this.traspasosFiltrados.length; i++){
      console.log(this.inventarioAct,"en el for final")
      var quer1 = `UPDATE tb_hh_inventario SET IN_CANTIDAD= ? WHERE IN_CLAVE =?`
      db.executeSql(quer1,[this.inventarioAct[i].IN_CANTIDAD,this.traspasosFiltrados[i].TR_CLAVE]).then(res =>{
        console.log(res,"update de base de datos termianda")
        this.Limpiartraspasos = 'DROP TABLE tb_hh_traspaso'
      db.executeSql(this.Limpiartraspasos,[]).then(() =>{
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
    this.Limpiartraspasos = 'DROP TABLE tb_hh_traspaso'
    db.executeSql(this.Limpiartraspasos,[]).then(() =>{
      this.navCtrl.setRoot("HomePage");
    })
  })
}

}
