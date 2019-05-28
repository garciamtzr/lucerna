import { Component } from '@angular/core';
import { MapPage } from '../map/map';
import { ListPage } from '../list/list';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MapMainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-map-main',
  templateUrl: 'map-main.html',
})
export class MapMainPage {

  tab1Root: any = MapPage;
  tab2Root: any = ListPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapMainPage');
  }

}
