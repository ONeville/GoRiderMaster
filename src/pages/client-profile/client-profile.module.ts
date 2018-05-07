import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClientProfilePage } from './client-profile';

@NgModule({
  declarations: [
    ClientProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(ClientProfilePage),
  ],
})
export class ClientProfilePageModule {}
