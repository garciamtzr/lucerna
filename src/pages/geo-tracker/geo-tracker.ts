import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse
} from '@ionic-native/background-geolocation';
/**
 * Generated class for the GeoTrackerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-geo-tracker',
  templateUrl: 'geo-tracker.html',
})
export class GeoTrackerPage {
  logs: string[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,private backgroundGeolocation: BackgroundGeolocation) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GeoTrackerPage');
  }
  
}
