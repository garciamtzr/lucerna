import { ClienteProvider } from './../../providers/cliente/cliente';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';




@IonicPage()
@Component({
  selector: 'page-clientes',
  templateUrl: 'clientes.html',
})
export class ClientesPage {

  clientes = [];
  clientesSQL: Array<any> = [];
  items: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private cliente: ClienteProvider,
    private sqlite: SQLite
    ) {

  }

  initializeItems() {
    this.items = this.clientesSQL;
  }

  getItems(ev: any){
    // Reset items back to all of the items

    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.CL_CLIENTE.toString().toUpperCase().indexOf(val.toUpperCase()) > -1);
      })
    }
  }


  getData() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
 
      db.executeSql('SELECT CL_CLIENTE, CL_NOMNEGOCIO, CL_PUNTOVENTA, CL_RFC, CL_DIRNEGOCIO, CL_COLNEGOCIO, CL_CPCLIE, CL_CORPORACION , CL_CIUDADNEGOCIO, CL_TIPOV FROM clientes', [])
      .then(res => {
        this.clientesSQL = [];
        for(var i=0; i<res.rows.length; i++) {
          this.clientesSQL.push({CL_CLIENTE:res.rows.item(i).CL_CLIENTE,CL_NOMNEGOCIO:res.rows.item(i).CL_NOMNEGOCIO,CL_CIUDADNEGOCIO:res.rows.item(i).CL_CIUDADNEGOCIO, CL_CPCLIE:res.rows.item(i).CL_CPCLIE,
            CL_PUNTOVENTA:res.rows.item(i).CL_PUNTOVENTA,CL_RFC:res.rows.item(i).CL_RFC,CL_DIRNEGOCIO:res.rows.item(i).CL_DIRNEGOCIO,
            CL_COLNEGOCIO:res.rows.item(i).CL_COLNEGOCIO, CL_CORPORACION:res.rows.item(i).CL_CORPORACION, CL_TIPOV:res.rows.item(i).CL_TIPOV
            })
        }
      })
      .catch(e => console.log(e));
  });
 
}



  ionViewDidLoad() {
   // this.getAllClientes();
   this.getData();
  }

  getAllClientes(){
    this.cliente.getClientes()
    .subscribe(res =>{
      console.log(res);
      this.clientes = res.result;
      this.getData();
    });
  }

  


  carritoVentas(event, clientesSQL){
    if(clientesSQL.CL_TIPOV == "SIN ASIGNAR"){
      alert("Error : No se puede vender a un cliente que no tenga un tipo de venta asignado");
    
    }else{
      this.navCtrl.setRoot("CarritoVtPage",{
        cliente: clientesSQL
      });
    }
    
  }

}
