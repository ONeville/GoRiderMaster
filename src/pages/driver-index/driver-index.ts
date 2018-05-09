import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { RiderState } from '../../models/enums';
/**
 * Generated class for the DriverIndexPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-driver-index',
  templateUrl: 'driver-index.html',
})
export class DriverIndexPage {
  driverStatus: RiderState;
  isAvailable: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DriverIndexPage');
  }

  notify() {
    console.log("Toggled: "+ this.isAvailable); 
  }
}
