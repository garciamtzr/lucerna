import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InicioDiaPage } from './inicio-dia';

@NgModule({
  declarations: [
    InicioDiaPage,
  ],
  imports: [
    IonicPageModule.forChild(InicioDiaPage),
  ],
})
export class InicioDiaPageModule {}
