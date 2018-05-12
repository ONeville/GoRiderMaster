import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { GeofireProvider } from '../../providers/geofire/geofire';
import { UtilsServices } from '../../models/model';
import { DriverPoolModel, DriverPoolService } from '../../models/driver/driverPool';
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
  isAvailable: boolean = false;
  utils: UtilsServices;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams
    , private geoFire: GeofireProvider) {
      this.utils = new UtilsServices()
  }

  ionViewDidLoad() {

  }

  notify() {
    console.log("Toggled: "+ this.isAvailable); 
  }

  inquireLocation(){
    let locationLb = this.utils.getID();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position)=>{

        var crd = position.coords;
        var latLng = {
          lat:crd.latitude,
          lng: crd.longitude
        }
        
        this.geoFire.setLocation(locationLb, [crd.latitude, crd.longitude])


        // this.navCtrl.push('LookupPage', { locations: data });

      }, ()=>{ console.warn(`ERROR: geolocation`);});

     }

  }
}
