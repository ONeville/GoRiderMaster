import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DriverIndexPage } from './driver-index';

@NgModule({
  declarations: [
    DriverIndexPage,
  ],
  imports: [
    IonicPageModule.forChild(DriverIndexPage),
  ],
})
export class DriverIndexPageModule {}
