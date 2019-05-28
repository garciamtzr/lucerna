import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PreVentaClientesPage } from './pre-venta-clientes';

@NgModule({
  declarations: [
    PreVentaClientesPage,
  ],
  imports: [
    IonicPageModule.forChild(PreVentaClientesPage),
  ],
})
export class PreVentaClientesPageModule {}
