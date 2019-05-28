import { Component, ɵConsole } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ToastController } from 'ionic-angular';
import { ProductoProvider } from '../../providers/producto/producto';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Storage } from '@ionic/storage';
import { NumberFormatStyle } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

/**
 * Generated class for the PrePromoModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pre-promo-modal',
  templateUrl: 'pre-promo-modal.html',
})
export class PrePromoModalPage {

  cliente
  promo91 =[]
  promo92 =[]
  promo93 =[]
  promo94 =[]
  promo95 =[]
  promo96 =[]
  promo97 =[]
  promo98 =[]
  productos: any;
  productosSQL: any=[];

  consulta: any;
  consulta2: any;

  searchQuery: string = '';
  items: any;
  myitem= [];
  promoClave: any;
  inruta: any;

  rutamail

promoSQL: any;
sqlpromo: any;

  tipoPrecioRuta: Number
  //tipRuta

  carrito: Array<any> = [];  //arreglo de objetos
 // objeto: Array<any> = []; //no usar esto creaun arreglo 
 objeto:any; //esto es solo un objeto
 
 promo1 = 0;
promo2 = 0;
promo3 = 0;
 promo4 = 0;
 promo5 = 0;
 promo6 = 0;
 promo7 = 0;
 promo8 = 0;
      

 exist1 = 0;
 exist2 = 0;
 exist3 = 0;
 exist4 = 0;
 exist5 = 0;
 exist6 = 0;
 exist7 = 0;
 exist8 = 0;

  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
      private view: ViewController,
       private producto:ProductoProvider,
       public alertCtrl:AlertController,
       private toastCtrl: ToastController,
       private Storage: Storage,
       private sqlite: SQLite) {

   // this.producto.getProductos().subscribe(res =>{
     // this.productos = res.result;}) 
     this.getData();
 

 

  }

  showPrompt(producto){   //ventana emergente para agregar cantidad de piezas
    if(producto === 'promo1'){
      producto = this.promo91;
    }else if(producto === 'promo2'){
      producto = this.promo92;
    }else if(producto === 'promo3'){
      producto = this.promo93;
    }else if(producto === 'promo4'){
      producto = this.promo94;
    }else if(producto === 'promo5'){
      producto = this.promo95;
    }else if(producto === 'promo6'){
      producto = this.promo96;
    }else if(producto === 'promo7'){
      producto = this.promo97;
    }else if(producto === 'promo8'){
      producto = this.promo98;
    }

    console.log(producto, "contenido de producto")
    
    const prompt = this.alertCtrl.create({
         

      title:'Cantidad',
      message:"Agrege cantidad de promos a vender",
      inputs: [
        {
          name:'cantidad',
          placeholder:'#',
          type:'tel'    //activa el teclado numerico con punto decimal; si se usa solo number no aparece la opcion para poner el punto.
        },
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
     
          if(Number(data.cantidad)){
            this.objeto 
            console.log(data.cantidad, "cantidad de promo")
            for(var i = 0; i<producto.length; i++){
              var promocanti = data.cantidad * producto[i].PM_CANTIDAD
              if( promocanti < 0 ){
                this.inventarioIn();
                this.closeModal();
               }else{
                 this.carrito.push(this.objeto ={    //si usamos [{ ...}], [{ ... }]  crea un arreglo de arreglos
                  promo:producto[i].PM_CLAVE_PROMO,
                  clave: producto[i].PM_CLAVE_PRODUCTO,
                  nombre: producto[i].PD_NOMBRE,
                  precio:producto[i].PM_PRECIOXUNIDAD_PROMO,
                  cantidad: data.cantidad * producto[i].PM_CANTIDAD,
                  iva:producto[i].IVA_FINAL*producto[i].PM_PRECIOXUNIDAD_PROMO * data.cantidad,
                  ieps:producto[i].IEPS_FINAL*producto[i].PM_PRECIOXUNIDAD_PROMO * data.cantidad,
                  importe: (data.cantidad * producto[i].PM_CANTIDAD * producto[i].PM_PRECIOXUNIDAD_PROMO) + (producto[i].IEPS_FINAL*producto[i].PM_PRECIOXUNIDAD_PROMO * data.cantidad * producto[i].PM_CANTIDAD) + producto[i].IVA_FINAL*producto[i].PM_PRECIOXUNIDAD_PROMO * data.cantidad * producto[i].PM_CANTIDAD,
                  equivalencia:producto[i].UM_CANTIDAD * data.cantidad * producto[i].PM_CANTIDAD
                })
              
                console.log(this.objeto, "objeto")
                }
    
            }
           
	  // }

           //this.carrito.push(this.objeto);  //agrega la seleccion especifica de producto. 
           console.log (this.carrito);
           this.closeModal();
          }else{
            this.presentToast();
          }


        }
        
      }
      ]
    });
    prompt.present();
  }

  initializeItems() {
    this.items = this.productosSQL;
  }

  /*
  getItems(ev: any){
    // Reset items back to all of the items

    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.PD_NOMBRE.toUpperCase().indexOf(val.toUpperCase()) > -1);
      })
    }
  }
  */

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalPage');
    this.obtenerRuta();
    //this.getTipoPrecio()
    this.cliente = this.navParams.get('cliente');
    this.tipoPrecioRuta = this.navParams.get('tipoRuta')
  }

  closeModal(){
    /*
    let data = {
     'carrito': this.carrito
    };
    */
    this.view.dismiss(this.carrito); //se envia el arreglo del carrito
   // console.log(producto);

  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Error: Captura no valida',
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  inventarioIn() {
    let toast = this.toastCtrl.create({
      message: 'Error: Insuficiente Inventario',
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }



  presentCosto() {
    let toast = this.toastCtrl.create({
      message: this.tipoPrecioRuta.toString(),
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  ionViewWillEnter(){
    
  }


  obtenerRuta(){
    this.Storage.get('useremail').then((val) =>{
      this.rutamail = parseInt(val);
      this.inruta = this.rutamail;
    })
  }

 getPromos(){
 //return new Promise(function(resolve, reject)
  this.sqlite.create({
    name: 'ionicdb.db',
    location: 'default'
  }).then((db: SQLiteObject) => {
    
    this.consulta = `select * FROM tb_hh_promos WHERE PM_ESTATUS = "VIGENTE" `


    //db.executeSql(this.consulta, [this.rutamail, this.cliente.CL_CLIENTE, this.tipoPrecioRuta])
    console.log();
    db.executeSql(this.consulta, [])
    .then(res => {
      this.promoSQL = [];
      this.sqlpromo = [];
      console.log("here we are")
      for(var i=0; i<res.rows.length; i++) {
        console.log(i, "vuelta")
        this.sqlpromo.push({PM_CLAVE_PRODUCTO:res.rows.item(i).PM_CLAVE_PRODUCTO, PM_CLAVE_PROMO:res.rows.item(i).PM_CLAVE_PROMO,
          PM_CANTIDAD:res.rows.item(i).PM_CANTIDAD,PM_PRECIOXUNIDAD_PROMO:res.rows.item(i).PM_PRECIOXUNIDAD_PROMO})
        
        for(var e=0; e<this.productosSQL.length; e++){

         
          console.log(this.productosSQL[e].PD_CLAVE)
          if(this.productosSQL[e].PD_CLAVE === res.rows.item(i).PM_CLAVE_PRODUCTO) {
            console.log("one goes in", this.productosSQL[e].PD_CLAVE)
            this.promoSQL.push({PM_CLAVE_PRODUCTO:res.rows.item(i).PM_CLAVE_PRODUCTO,
               PM_CLAVE_PROMO:res.rows.item(i).PM_CLAVE_PROMO,
              PM_CANTIDAD:res.rows.item(i).PM_CANTIDAD,
              PM_PRECIOXUNIDAD_PROMO:res.rows.item(i).PM_PRECIOXUNIDAD_PROMO,
              EXISTENCIA:this.productosSQL[e].EXISTENCIA,
              UM_CANTIDAD:this.productosSQL[e].UM_CANTIDAD,
              IVA_FINAL:this.productosSQL[e].IVA_FINAL,
              IEPS_FINAL:this.productosSQL[e].IEPS_FINAL,
              PD_NOMBRE:this.productosSQL[e].PD_NOMBRE})
          }
        
        }
        console.log(this.sqlpromo)
        console.log(this.promoSQL)
      }
      return this.sqlpromo
     
    }).then(res =>{


        for(var f = 0; f<this.sqlpromo.length; f++){
          if(this.sqlpromo[f].PM_CLAVE_PROMO === 9991){
            this.promo1 = this.promo1+1
            // console.log(this.promo1, "promo 1") 
          }else if(this.sqlpromo[f].PM_CLAVE_PROMO === 9992){
            this.promo2 = this.promo2+1
           // console.log(this.promo2, "promo 2")
          }else if(this.sqlpromo[f].PM_CLAVE_PROMO === 9993){
            this.promo3 = this.promo3+1
            // console.log(this.promo3, "promo 3")
          }else if(this.sqlpromo[f].PM_CLAVE_PROMO === 9994){
            this.promo4 = this.promo4+1
            // console.log(this.promo4, "promo 4")
          }else if(this.sqlpromo[f].PM_CLAVE_PROMO === 9995){
            this.promo5 = this.promo5+1
            // console.log(this.promo5, "promo 5")
          }else if(this.sqlpromo[f].PM_CLAVE_PROMO === 9996){
            this.promo6 = this.promo6+1
            // console.log(this.promo6, "promo 6")
          }else if(this.sqlpromo[f].PM_CLAVE_PROMO === 9997){
            this.promo7 = this.promo7+1
           //  console.log(this.promo7, "promo 7")
          }else if(this.sqlpromo[f].PM_CLAVE_PROMO === 9998){
            this.promo8 = this.promo8+1
           //  console.log(this.promo8, "promo 8")
          }
        }
  //***************************************************************/
  for(var f = 0; f<this.promoSQL.length; f++){
          if(this.promoSQL[f].PM_CLAVE_PROMO === 9991){
            this.exist1 = this.exist1+1
           // console.log(this.exist1, "promo 1 en promo sql")
          }else if(this.promoSQL[f].PM_CLAVE_PROMO === 9992){
            this.exist2 = this.exist2+1
          //  console.log(this.exist2, "promo 2 en promo sql")
          }else if(this.promoSQL[f].PM_CLAVE_PROMO === 9993){
            this.exist3 = this.exist3+1
          //   console.log(this.exist3, "promo 3 en promo sql")
          }else if(this.promoSQL[f].PM_CLAVE_PROMO === 9994){
            this.exist4 = this.exist4+1
          //   console.log(this.exist4, "promo 4 en promo sql")
          }else if(this.promoSQL[f].PM_CLAVE_PROMO === 9995){
            this.exist5 = this.exist5+1
           //  console.log(this.exist5, "promo 5 en promo sql")
          }else if(this.promoSQL[f].PM_CLAVE_PROMO === 9996){
            this.exist6 = this.exist6+1
           //  console.log(this.exist6, "promo 6 en promo sql")
          }else if(this.promoSQL[f].PM_CLAVE_PROMO === 9997){
            this.exist7 = this.exist7+1
           //  console.log(this.exist7, "promo 7 en promo sql")
          }else if(this.promoSQL[f].PM_CLAVE_PROMO === 9998){
            this.exist8 = this.exist8+1
           //  console.log(this.exist8, "promo 8 en promo sql")
          }
        }
        
        
        if (this.promoSQL.length == f-1){
         return this.promoSQL
        }
        
       
      
    }).then(res =>{
      if(this.promo1 != this.exist1){

       // console.log("hay diferencia en promo uno")
        for (var i = this.promoSQL.length - 1; i >= 0; --i) {
          if (this.promoSQL[i].PM_CLAVE_PROMO == 9991) {
              this.promoSQL.splice(i,1);
          }
      }
    }
    return this.promoSQL
      
    }).then(res =>{
      if(this.promo2 != this.exist2){
      //  console.log("hay diferencia en promo 2")
        for (var i = this.promoSQL.length - 1; i >= 0; --i) {
          if (this.promoSQL[i].PM_CLAVE_PROMO == 9992) {
              this.promoSQL.splice(i,1);
          }
      }
      }
      return this.promoSQL
    }).then(res =>{

      if(this.promo3 != this.exist3){
       // console.log("hay diferencia en promo 3")
        for (var i = this.promoSQL.length - 1; i >= 0; --i) {
          if (this.promoSQL[i].PM_CLAVE_PROMO == 9993) {
              this.promoSQL.splice(i,1);
          }
      }
      }
      return this.promoSQL
    }).then(res =>{
      if(this.promo4 != this.exist4){
      //  console.log("hay diferencia en promo 4")
        for (var i = this.promoSQL.length - 1; i >= 0; --i) {
          if (this.promoSQL[i].PM_CLAVE_PROMO == 9994) {
              this.promoSQL.splice(i,1);
          }
      }
      }
      return this.promoSQL
    }).then(res =>{
      if(this.promo5 != this.exist5){
     //   console.log("hay diferencia en promo 5")
        for (var i = this.promoSQL.length - 1; i >= 0; --i) {
          if (this.promoSQL[i].PM_CLAVE_PROMO == 9995) {
              this.promoSQL.splice(i,1);
          }
      }
      }
     return this.promoSQL
    }).then(res =>{
      if(this.promo6 != this.exist6){
      //  console.log("hay diferencia en promo 6")
        for (var i = this.promoSQL.length - 1; i >= 0; --i) {
          if (this.promoSQL[i].PM_CLAVE_PROMO == 9996) {
              this.promoSQL.splice(i,1);
          }
      }
      }
      return this.promoSQL
    }).then(res =>{
      if(this.promo7 != this.exist7){
      //  console.log("hay diferencia en promo 7")
        for (var i = this.promoSQL.length - 1; i >= 0; --i) {
          if (this.promoSQL[i].PM_CLAVE_PROMO == 9997) {
              this.promoSQL.splice(i,1);
          }
      }
      }
      return this.promoSQL
    }).then(res =>{
      if(this.promo8 != this.exist8){
     //   console.log("hay diferencia en promo 8")
        for (var i = this.promoSQL.length - 1; i >= 0; --i) {
          if (this.promoSQL[i].PM_CLAVE_PROMO == 9998) {
              this.promoSQL.splice(i,1);
          }
      }
      }
      return this.promoSQL
    }).then(res =>{

      for(var i = 0; i<this.promoSQL.length;i++){
        if(this.promoSQL[i].PM_CLAVE_PROMO === 9991){

          this.promo91.push({PM_CLAVE_PRODUCTO:this.promoSQL[i].PM_CLAVE_PRODUCTO,
            PM_CLAVE_PROMO:this.promoSQL[i].PM_CLAVE_PROMO,
           PM_CANTIDAD:this.promoSQL[i].PM_CANTIDAD,
           PM_PRECIOXUNIDAD_PROMO:this.promoSQL[i].PM_PRECIOXUNIDAD_PROMO,
           EXISTENCIA:this.promoSQL[i].EXISTENCIA,
           UM_CANTIDAD:this.promoSQL[i].UM_CANTIDAD,
           IVA_FINAL:this.promoSQL[i].IVA_FINAL,
           IEPS_FINAL:this.promoSQL[i].IEPS_FINAL,
           PD_NOMBRE:this.promoSQL[i].PD_NOMBRE})
        }

        if(this.promoSQL[i].PM_CLAVE_PROMO === 9992){

          this.promo92.push({PM_CLAVE_PRODUCTO:this.promoSQL[i].PM_CLAVE_PRODUCTO,
            PM_CLAVE_PROMO:this.promoSQL[i].PM_CLAVE_PROMO,
           PM_CANTIDAD:this.promoSQL[i].PM_CANTIDAD,
           PM_PRECIOXUNIDAD_PROMO:this.promoSQL[i].PM_PRECIOXUNIDAD_PROMO,
           EXISTENCIA:this.promoSQL[i].EXISTENCIA,
           UM_CANTIDAD:this.promoSQL[i].UM_CANTIDAD,
           IVA_FINAL:this.promoSQL[i].IVA_FINAL,
           IEPS_FINAL:this.promoSQL[i].IEPS_FINAL,
           PD_NOMBRE:this.promoSQL[i].PD_NOMBRE})
        }

        if(this.promoSQL[i].PM_CLAVE_PROMO === 9993){

          this.promo93.push({PM_CLAVE_PRODUCTO:this.promoSQL[i].PM_CLAVE_PRODUCTO,
            PM_CLAVE_PROMO:this.promoSQL[i].PM_CLAVE_PROMO,
           PM_CANTIDAD:this.promoSQL[i].PM_CANTIDAD,
           PM_PRECIOXUNIDAD_PROMO:this.promoSQL[i].PM_PRECIOXUNIDAD_PROMO,
           EXISTENCIA:this.promoSQL[i].EXISTENCIA,
           UM_CANTIDAD:this.promoSQL[i].UM_CANTIDAD,
           IVA_FINAL:this.promoSQL[i].IVA_FINAL,
           IEPS_FINAL:this.promoSQL[i].IEPS_FINAL,
           PD_NOMBRE:this.promoSQL[i].PD_NOMBRE})
        }

        if(this.promoSQL[i].PM_CLAVE_PROMO === 9994){

          this.promo94.push({PM_CLAVE_PRODUCTO:this.promoSQL[i].PM_CLAVE_PRODUCTO,
            PM_CLAVE_PROMO:this.promoSQL[i].PM_CLAVE_PROMO,
           PM_CANTIDAD:this.promoSQL[i].PM_CANTIDAD,
           PM_PRECIOXUNIDAD_PROMO:this.promoSQL[i].PM_PRECIOXUNIDAD_PROMO,
           EXISTENCIA:this.promoSQL[i].EXISTENCIA,
           UM_CANTIDAD:this.promoSQL[i].UM_CANTIDAD,
           IVA_FINAL:this.promoSQL[i].IVA_FINAL,
           IEPS_FINAL:this.promoSQL[i].IEPS_FINAL,
           PD_NOMBRE:this.promoSQL[i].PD_NOMBRE})
        }

        if(this.promoSQL[i].PM_CLAVE_PROMO === 9995){

          this.promo95.push({PM_CLAVE_PRODUCTO:this.promoSQL[i].PM_CLAVE_PRODUCTO,
            PM_CLAVE_PROMO:this.promoSQL[i].PM_CLAVE_PROMO,
           PM_CANTIDAD:this.promoSQL[i].PM_CANTIDAD,
           PM_PRECIOXUNIDAD_PROMO:this.promoSQL[i].PM_PRECIOXUNIDAD_PROMO,
           EXISTENCIA:this.promoSQL[i].EXISTENCIA,
           UM_CANTIDAD:this.promoSQL[i].UM_CANTIDAD,
           IVA_FINAL:this.promoSQL[i].IVA_FINAL,
           IEPS_FINAL:this.promoSQL[i].IEPS_FINAL,
           PD_NOMBRE:this.promoSQL[i].PD_NOMBRE})
        }

        if(this.promoSQL[i].PM_CLAVE_PROMO === 9996){

          this.promo96.push({PM_CLAVE_PRODUCTO:this.promoSQL[i].PM_CLAVE_PRODUCTO,
            PM_CLAVE_PROMO:this.promoSQL[i].PM_CLAVE_PROMO,
           PM_CANTIDAD:this.promoSQL[i].PM_CANTIDAD,
           PM_PRECIOXUNIDAD_PROMO:this.promoSQL[i].PM_PRECIOXUNIDAD_PROMO,
           EXISTENCIA:this.promoSQL[i].EXISTENCIA,
           UM_CANTIDAD:this.promoSQL[i].UM_CANTIDAD,
           IVA_FINAL:this.promoSQL[i].IVA_FINAL,
           IEPS_FINAL:this.promoSQL[i].IEPS_FINAL,
           PD_NOMBRE:this.promoSQL[i].PD_NOMBRE})
        }

        if(this.promoSQL[i].PM_CLAVE_PROMO === 9997){

          this.promo97.push({PM_CLAVE_PRODUCTO:this.promoSQL[i].PM_CLAVE_PRODUCTO,
            PM_CLAVE_PROMO:this.promoSQL[i].PM_CLAVE_PROMO,
           PM_CANTIDAD:this.promoSQL[i].PM_CANTIDAD,
           PM_PRECIOXUNIDAD_PROMO:this.promoSQL[i].PM_PRECIOXUNIDAD_PROMO,
           EXISTENCIA:this.promoSQL[i].EXISTENCIA,
           UM_CANTIDAD:this.promoSQL[i].UM_CANTIDAD,
           IVA_FINAL:this.promoSQL[i].IVA_FINAL,
           IEPS_FINAL:this.promoSQL[i].IEPS_FINAL,
           PD_NOMBRE:this.promoSQL[i].PD_NOMBRE})
        }

        if(this.promoSQL[i].PM_CLAVE_PROMO === 9998){

          this.promo98.push({PM_CLAVE_PRODUCTO:this.promoSQL[i].PM_CLAVE_PRODUCTO,
            PM_CLAVE_PROMO:this.promoSQL[i].PM_CLAVE_PROMO,
           PM_CANTIDAD:this.promoSQL[i].PM_CANTIDAD,
           PM_PRECIOXUNIDAD_PROMO:this.promoSQL[i].PM_PRECIOXUNIDAD_PROMO,
           EXISTENCIA:this.promoSQL[i].EXISTENCIA,
           UM_CANTIDAD:this.promoSQL[i].UM_CANTIDAD,
           IVA_FINAL:this.promoSQL[i].IVA_FINAL,
           IEPS_FINAL:this.promoSQL[i].IEPS_FINAL,
           PD_NOMBRE:this.promoSQL[i].PD_NOMBRE})
        }

      }
    //  console.log(this.promo91)
    //  console.log(this.promo92)
     // console.log(this.promo93)
     // console.log(this.promo94)
    //  console.log(this.promo95)
    //  console.log(this.promo96)
    //  console.log(this.promo97)
    //  console.log(this.promo98)
    })
    .catch(e => console.log(e));
});
 // })
  
}

  



  getData() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      
      this.consulta = `select * from(
        SELECT PD_CLAVE, PD_NOMBRE, PD_UM, PD_GRUPO, CASE WHEN PRC_PRECIO_ESPECIAL IS NOT NULL THEN PRC_PRECIO_ESPECIAL ELSE PR_PRECIO END AS PRECIO_FINAL, CASE WHEN  PRC_IVA IS NOT NULL THEN PRC_IVA ELSE PR_IVA END IVA_FINAL, CASE WHEN PRC_IEPS IS NOT NULL THEN PRC_IEPS ELSE PR_IEPS END AS IEPS_FINAL, PR_SUCURSAL, PR_EMPRESA,UM_CANTIDAD, IN_CANTIDAD AS EXISTENCIA/**/
                  FROM (SELECT Cve.PD_CLAVE, Cve.PD_NOMBRE, Cve.PD_UM, Cve.PD_GRUPO, Cve.PRC_PRECIO_ESPECIAL, Cve.PRC_IVA, Cve.PRC_IEPS, Cve.PR_PRECIO, Cve.PR_IVA, Cve.PR_IEPS, Cve.PR_SUCURSAL, Cve.PR_EMPRESA, Cve.UM_CANTIDAD, Inv.IN_CANTIDAD
              
          FROM( SELECT A.PD_CLAVE, A.PD_NOMBRE, A.PD_UM, A.PD_GRUPO,A.PRC_PRECIO_ESPECIAL, A.PRC_IVA, A.PRC_IEPS, B.PR_PRECIO, B.PR_IVA, B.PR_IEPS, B.PR_SUCURSAL, B.PR_EMPRESA, A.UM_CANTIDAD /**/
                               FROM (SELECT Y.PD_CLAVE, Y.PD_NOMBRE, Y.PD_UM, Y.PD_GRUPO, X.PRC_CLAVE, X.PRC_PRECIO_ESPECIAL, X.PRC_IVA, X.PRC_IEPS, Y.UM_CANTIDAD /**/
                                    FROM (SELECT PD_CLAVE, PD_NOMBRE, PD_UM, PD_GRUPO, UM_CANTIDAD/**/ FROM tb_hh_productos  WHERE (PD_BAJA <> 'B')) AS Y
                                                    LEFT JOIN
                                           (SELECT  PRC_CLAVE, PRC_PRECIO_ESPECIAL, PRC_IVA, PRC_IEPS FROM tb_hh_precio_cliente WHERE  (PRC_RUTA_CLIE = ?) AND (PRC_CLIENTE = ?)) AS X 
                                                           ON Y.PD_CLAVE = X.PRC_CLAVE) AS A
                                                     LEFT JOIN
                                           (SELECT PR_CLAVE, PR_PRECIO, PR_IVA, PR_IEPS, PR_SUCURSAL, PR_EMPRESA FROM  tb_hh_precios WHERE (PR_TIPO_PRECIO = ?)) AS B
                                                           ON A.PD_CLAVE = B.PR_CLAVE) AS Cve
                               INNER JOIN
                          (SELECT IN_CLAVE, IN_CANTIDAD FROM tb_hh_inventario) AS Inv   
                                          ON Cve.PD_CLAVE=Inv.IN_CLAVE ) AS P) F where PRECIO_FINAL is not null AND EXISTENCIA is not null ORDER BY PD_CLAVE DESC`


      //db.executeSql(this.consulta, [this.rutamail, this.cliente.CL_CLIENTE, this.tipoPrecioRuta])
      db.executeSql(this.consulta, [this.rutamail, this.cliente.CL_CLIENTE, this.tipoPrecioRuta])
      .then(res => {
        this.productosSQL = [];
        for(var i=0; i<res.rows.length; i++) {
          this.productosSQL.push({PD_CLAVE:res.rows.item(i).PD_CLAVE,PD_NOMBRE:res.rows.item(i).PD_NOMBRE, 
            PD_UM:res.rows.item(i).PD_UM,
            PD_GRUPO:res.rows.item(i).PD_GRUPO, 
            PRECIO_FINAL:res.rows.item(i).PRECIO_FINAL, 
            IVA_FINAL:res.rows.item(i).IVA_FINAL,
            IEPS_FINAL:res.rows.item(i).IEPS_FINAL,
            PR_SUCURSAL:res.rows.item(i).PR_SUCURSAL,
            PR_EMPRESA:res.rows.item(i).PR_EMPRESA,
            UM_CANTIDAD:res.rows.item(i).UM_CANTIDAD,
            EXISTENCIA:res.rows.item(i).EXISTENCIA
          })
        }
      })
      .catch(e => console.log(e));
      
  });
  this.getPromos();
}


}
