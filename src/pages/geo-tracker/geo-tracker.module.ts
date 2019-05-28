import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GeoTrackerPage } from './geo-tracker';

@NgModule({
  declarations: [
    GeoTrackerPage,
  ],
  imports: [
    IonicPageModule.forChild(GeoTrackerPage),
  ],
})
export class GeoTrackerPageModule {}
