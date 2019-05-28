import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ToastController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';


/**
 * Generated class for the InventarioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-inventario',
  templateUrl: 'inventario.html',
})
export class InventarioPage {

  inventario: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,private sqlite: SQLite) {
    this.getInventario()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InventarioPage');
  }

  getInventario(){
    //return new Promise(function(resolve, reject)
     this.sqlite.create({
       name: 'ionicdb.db',
       location: 'default'
     }).then((db: SQLiteObject) => {
       var query = 'SELECT IN_CLAVE, IN_CANTIDAD FROM tb_hh_inventario'

        db.executeSql(query,[]).then(res =>{
         this.inventario =[];

         for(var i=0; i<res.rows.length; i++) {
          this.inventario.push({IN_CLAVE:res.rows.item(i).IN_CLAVE, IN_CANTIDAD:res.rows.item(i).IN_CANTIDAD})
        }

       })
     })}

}
