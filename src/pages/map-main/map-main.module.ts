import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapMainPage } from './map-main';

@NgModule({
  declarations: [
    MapMainPage,
  ],
  imports: [
    IonicPageModule.forChild(MapMainPage),
  ],
})
export class MapMainPageModule {}
