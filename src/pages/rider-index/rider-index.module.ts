import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RiderIndexPage } from './rider-index';

@NgModule({
  declarations: [
    RiderIndexPage,
  ],
  imports: [
    IonicPageModule.forChild(RiderIndexPage),
  ],
})
export class RiderIndexPageModule {}
