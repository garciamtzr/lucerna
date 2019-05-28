import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { RegisterProvider } from '../../providers/register/register';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  email: string;
  password: string;
  imagenes: any = [];

  loading: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private reg: RegisterProvider,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private Storage: Storage
    ) {
      this.imgAJson()
  }

  ionViewDidLoad() {
    
  } 
// funcion para redirigir a pagina de registro de usuarios
  registerPage(){
     this.navCtrl.push("RegisterPage");
  }

  login(){

    if(this.email !== undefined || this.email !== undefined){
      this.showLoading();
      this.reg.loginUser(this.email, this.password)
      .subscribe(res =>{
        this.loading.dismiss();
        if(res.user){
          this.Storage.set('useremail', res.user.email);
          this.navCtrl.setRoot("HomePage",{
            email: res.user.email
          });
        }
  
        if(res.error){
          let alert = this.alertCtrl.create({
            title: 'Login Error',
            subTitle: res.error,
            buttons: ['Ok']
            
          });
          alert.present();
        }
  
      });
  

      this.email = '';
      this.password = '';
    }else{
      let alert = this.alertCtrl.create({
        title: 'Login Error',
        subTitle: 'You cannot submit empty fields',
        buttons: ['Ok']
        
      });
      alert.present();

    }
  }

  showLoading(){
    this.loading = this.loadingCtrl.create({
      content: 'Authenticating..',
      duration: 3000
    });

    this.loading.present();
  }
//agregar clave con imagen nueva por clave
  imgAJson(){
    this.imagenes.push(
      {clave:2,imgs:"assets/imgs/2.png"},
      {clave:3,imgs:"assets/imgs/3.png"},
      {clave:4,imgs:"assets/imgs/4.png"},
      {clave:5,imgs:"assets/imgs/5.png"},
      {clave:6,imgs:"assets/imgs/6.png"},
    {clave:7,imgs:"assets/imgs/7.png" },
    {clave:11,imgs:"assets/imgs/11.png"},
    {clave:12,imgs:"assets/imgs/12.png"},
    {clave:13,imgs:"assets/imgs/13.png"},
    {clave:32,imgs:"assets/imgs/32.png"},
    {clave:33,imgs:"assets/imgs/33.png"},
    {clave:34,imgs:"assets/imgs/34.png"},
    {clave:35,imgs:"assets/imgs/35.png"},
    {clave:110,imgs:"assets/imgs/110.png"},
    {clave:111,imgs:"assets/imgs/111.png"},
    {clave:131,imgs:"assets/imgs/131.png"},
    {clave:132,imgs:"assets/imgs/132.png"},
    {clave:134,imgs:"assets/imgs/134.png"},
    {clave:135,imgs:"assets/imgs/135.png"},
    {clave:136,imgs:"assets/imgs/136.png"},
    {clave:150,imgs:"assets/imgs/150.png"},
    {clave:152,imgs:"assets/imgs/152.png"},
    {clave:155,imgs:"assets/imgs/155.png"},
    {clave:159,imgs:"assets/imgs/159.png"},
    {clave:163,imgs:"assets/imgs/163.png"},
    {clave:164,imgs:"assets/imgs/164.png"},
    {clave:165,imgs:"assets/imgs/165.png"},
    {clave:178,imgs:"assets/imgs/178.png"},
    {clave:189,imgs:"assets/imgs/189.png"},
    {clave:191,imgs:"assets/imgs/191.png"},
    {clave:192,imgs:"assets/imgs/192.png"},
    {clave:193,imgs:"assets/imgs/193.png"},
    {clave:195,imgs:"assets/imgs/195.png"},
    {clave:197,imgs:"assets/imgs/197.png"},
    {clave:199,imgs:"assets/imgs/199.png"},
    {clave:201,imgs:"assets/imgs/201.png"},
    {clave:203,imgs:"assets/imgs/203.png"},
    {clave:204,imgs:"assets/imgs/204.png"},
    {clave:216,imgs:"assets/imgs/216.png"},
    {clave:217,imgs:"assets/imgs/217.png"},
    {clave:218,imgs:"assets/imgs/218.png"},
    {clave:251,imgs:"assets/imgs/251.png"},
    {clave:252,imgs:"assets/imgs/252.png"},
    {clave:253,imgs:"assets/imgs/253.png"},
    {clave:254,imgs:"assets/imgs/254.png"},
    {clave:255,imgs:"assets/imgs/255.png"},
    {clave:257,imgs:"assets/imgs/257.png"},
    {clave:285,imgs:"assets/imgs/285.png"},
    {clave:286,imgs:"assets/imgs/286.png"},
    {clave:287,imgs:"assets/imgs/287.png"},
    {clave:289,imgs:"assets/imgs/289.png"},
    {clave:299,imgs:"assets/imgs/299.png"},
    {clave:301,imgs:"assets/imgs/301.png"},
    {clave:302,imgs:"assets/imgs/302.png"},
    {clave:303,imgs:"assets/imgs/303.png"},
    {clave:304,imgs:"assets/imgs/304.png"},
    {clave:305,imgs:"assets/imgs/305.png"},
    {clave:310,imgs:"assets/imgs/310.png"},
    {clave:316,imgs:"assets/imgs/316.png"},
    {clave:317,imgs:"assets/imgs/317.png"},
    {clave:318,imgs:"assets/imgs/318.png"},
    {clave:353,imgs:"assets/imgs/353.png"},
    {clave:355,imgs:"assets/imgs/355.png"},
    {clave:380,imgs:"assets/imgs/380.png"},
    {clave:384,imgs:"assets/imgs/logo.png"},
    {clave:385,imgs:"assets/imgs/385.png"},
    {clave:389,imgs:"assets/imgs/389.png"},
    {clave:398,imgs:"assets/imgs/398.png"},
    {clave:590,imgs:"assets/imgs/590.png"},
    {clave:404,imgs:"assets/imgs/404.png"},
    {clave:500,imgs:"assets/imgs/500.png"},
    {clave:602,imgs:"assets/imgs/602.png"},
    {clave:603,imgs:"assets/imgs/603.png"},
    {clave:605,imgs:"assets/imgs/605.png"},
    {clave:606,imgs:"assets/imgs/606.png"},
    {clave:610,imgs:"assets/imgs/610.png"},
    {clave:611,imgs:"assets/imgs/611.png"},
    {clave:612,imgs:"assets/imgs/612.png"},
    {clave:613,imgs:"assets/imgs/613.png"},
    {clave:614,imgs:"assets/imgs/614.png"},
    {clave:615,imgs:"assets/imgs/615.png"},
    {clave:616,imgs:"assets/imgs/616.png"},
    {clave:617,imgs:"assets/imgs/617.png"},
    {clave:618,imgs:"assets/imgs/618.png"},
    {clave:670,imgs:"assets/imgs/670.png"},
    {clave:671,imgs:"assets/imgs/671.png"},
    {clave:675,imgs:"assets/imgs/675.png"},
    {clave:684,imgs:"assets/imgs/684.png"},
    {clave:685,imgs:"assets/imgs/685.png"},
    {clave:687,imgs:"assets/imgs/687.png"},
    {clave:689,imgs:"assets/imgs/689.png"},
    {clave:690,imgs:"assets/imgs/690.png"})//.then(res =>{
      this.Storage.set('imagenes', this.imagenes)
    //})
  }
   
    
  }

