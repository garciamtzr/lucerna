import { Component } from '@angular/core';
import { NavController,IonicPage, Content, AlertController } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { ClienteProvider } from './../../providers/cliente/cliente';


/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;
declare var SqlServer: any;
@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  map: any;
  popup: any;
  Popup;
  idCliente: Number;
  objeto: any;
  latitude: any;
  longitude: any;
  clientes = [];
  
  constructor(public navCtrl: NavController,public geolocation: Geolocation, private alertCtrl: AlertController,private cliente: ClienteProvider,) {
    SqlServer.init("201.174.70.186", "SQLSERVER", "sa", "TuLucernita2017", "SistemaComercial", function(event) {
      // alert(JSON.stringify(event));
       
     }, function(error) {
       alert(JSON.stringify(error));
     });

  }

  ionViewDidLoad(){
    this.getPosition();
    this.getJSON();
  }

  async getJSON(){
    try{
    const cliePromise = this.cliente.getClientes().subscribe(res =>{
      console.log(res);
      this.clientes = res.result;});
  
      await Promise.all([cliePromise]);
     }catch(error){
  
      if(error){
        let alert = this.alertCtrl.create({
          title: 'Error no tienes red',
          subTitle: error,
          buttons: ['Ok']
        });
        alert.present();
      }
  }
  }

  presentConfirm(clienteNom,numClie) {
    let alerta = this.alertCtrl.create({
      title: 'Confirmar captura',
      message: 'para el cliente' + clienteNom,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.objeto = [    //si usamos [{ ...}], [{ ... }]  crea un arreglo de arreglos
            this.idCliente = parseInt(numClie),
            this.latitude, this.longitude
          ]
    
          SqlServer.execute("UPDATE TB_CLIENTE_RESPALDO SET  CL_LATITUD ="+this.latitude.toString()+", CL_LONGITUD ="+this.longitude.toString()+" WHERE CL_CLIENTE ="+this.idCliente+"", function(event) {    
     
            alert("Cordenadas agregadas : " + JSON.stringify(event));
           
          }, function(error) {
            alert("Error : " + JSON.stringify(error));
          });
          console.log(this.objeto)
          }
        }
      ]
    });
    alerta.present();
  }


  showPrompt(){   //ventana emergente para agregar cantidad de piezas
     
    
    const prompt = this.alertCtrl.create({
         
  
      title:'Captura de Cliente',
      message:"Agrega el # de Cliente",
      inputs: [
        {
          name:'idClientes',
          placeholder:'# de Cliente',
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
        for(var i=0; i<this.clientes.length; i++){
          if(this.clientes[i].CL_CLIENTE === parseInt(data.idClientes) ){
              this.presentConfirm(this.clientes[i].CL_NOMNEGOCIO, data.idClientes); 
          }//if

        }//for
        }
      }
      ]
    });
    prompt.present();
  }

  //obtiene cordenadas
  getPosition():any{
    this.geolocation.getCurrentPosition().then(response => {
      this.loadMap(response);
    })
    .catch(error =>{
      console.log(error);
    })
  }

  //carga mapa
  loadMap(position: Geoposition){
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;
    console.log(this.latitude, this.longitude);
    
    // crear elemento de mapa
    var mapEle: HTMLElement = document.getElementById('map');
  
    // objeto de latitud
    var myLatLng = {lat: this.latitude, lng: this.longitude};
  
    // crear mapa
    /*
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -33.9, lng: 151.1},
      zoom: 10,
    });
    */
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 14
    });
  /* esto no esta funcionando todavia
   google.maps.event.addListenerOnce(this.map, 'idle', () => {
    var marker = new google.maps.Marker({
      position: myLatLng,
        map: this.map,
        title: 'AQUI ESTOY!'
      });
      marker.setMap(this.map);
    });
*/

this.Popup = this.createPopupClass();
var popup = new this.Popup(
  new google.maps.LatLng(myLatLng),
  document.getElementById('content')
);
popup.setMap(this.map);
  }

  createPopupClass(){
  function  Popup(position, content){
      this.position = position;
      content.classList.add('popup-bubble');

       // This zero-height div is positioned at the bottom of the bubble.
    var bubbleAnchor = document.createElement('div');
    bubbleAnchor.classList.add('popup-bubble-anchor');
    bubbleAnchor.appendChild(content);

    // This zero-height div is positioned at the bottom of the tip.
    this.containerDiv = document.createElement('div');
    this.containerDiv.classList.add('popup-container');
    this.containerDiv.appendChild(bubbleAnchor);

    // Optionally stop clicks, etc., from bubbling up to the map.
    google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.containerDiv);
  }
  // ES5 magic to extend google.maps.OverlayView.
  Popup.prototype = Object.create(google.maps.OverlayView.prototype);
/** Called when the popup is added to the map. */
Popup.prototype.onAdd = function() {
  this.getPanes().floatPane.appendChild(this.containerDiv);
    }
    
  /** Called each frame when the popup needs to draw itself. */
  Popup.prototype.draw = function() {
    var divPosition = this.getProjection().fromLatLngToDivPixel(this.position);

    // Hide the popup when it is far out of view.
    var display =
        Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000 ?
        'block' :
        'none';

    if (display === 'block') {
      this.containerDiv.style.left = divPosition.x + 'px';
      this.containerDiv.style.top = divPosition.y + 'px';
    }
    if (this.containerDiv.style.display !== display) {
      this.containerDiv.style.display = display;
    }
  };

  return Popup;
  }

}


