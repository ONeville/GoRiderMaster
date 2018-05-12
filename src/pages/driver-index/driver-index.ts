import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { GeofireProvider } from '../../providers/geofire/geofire';
import { UtilsServices } from '../../models/model';
import { DriverPoolModel, DriverPoolService } from '../../models/driver/driverPool';
import { DriverProfileModel } from '../../models/driver/driverProfile';
import { UserLoginModel } from '../../models/userLoging';
import { RiderState } from '../../models/enums';
import { Profile02Provider } from '../../providers/profile/profile02';
import { UserType } from '../../models/enums';
// import { DriverPoolModel, DriverPoolService } from '../../models/driver/driverPool';
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

  userProfile: UserLoginModel;
  driverModel: DriverProfileModel;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams
    , private geoFire: GeofireProvider
    , private profileProvider: Profile02Provider) {
      this.utils = new UtilsServices()
      this.profileProvider.authenticated(UserType.Driver.toString())
  }

  ionViewDidLoad() {
    this.userProfile = this.profileProvider.getUserProfile();
    if (this.userProfile) {
      this.navCtrl.push('LoginPage');
    }
    this.driverModel = this.profileProvider.getDriver();
  }

  notify() {
    console.log("Toggled: "+ this.isAvailable); 
  }

  inquireLocation(){
    let locationLb = this.utils.getID();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position)=>{

        var driver = new DriverPoolModel();
        driver.setModel(0, 0, 0.56, [crd.latitude, crd.longitude], new Date())


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
