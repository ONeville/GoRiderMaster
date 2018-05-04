import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClientIndexPage } from './client-index';

@NgModule({
  declarations: [
    ClientIndexPage,
  ],
  imports: [
    IonicPageModule.forChild(ClientIndexPage),
  ],
})
export class ClientIndexPageModule {}
