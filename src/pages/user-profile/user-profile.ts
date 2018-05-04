import { Component } from '@angular/core';
import { 
  NavController, 
  Loading,
  LoadingController,
  AlertController, MenuController  } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { IonicPage } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';


import { Profile02Provider } from '../../providers/profile/profile02';

import { UserLoginModel } from '../../models/userLoging';
import { PassengerProfileModel } from '../../models/passengerProfile';
import { DriverProfileModel } from '../../models/driverProfile';

@IonicPage()
/**
 * Generated class for the PhonePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {
  public phoneForm: FormGroup;
  public profileForm: FormGroup;
  loading: Loading;
  public currentUser: UserLoginModel;


  constructor(public navCtrl: NavController, public stB: StatusBar, public menu: MenuController, public authProvider: AuthProvider, 
    public formBuilder: FormBuilder, public loadingCtrl: LoadingController, 
    public alertCtrl: AlertController, private profile:Profile02Provider) {
      menu.swipeEnable(false, 'menu1');
      this.phoneForm = formBuilder.group({
        phone: ['', Validators.compose([Validators.minLength(11), Validators.maxLength(11), Validators.required])],
      });
      this.currentUser = this.profile.getUserProfile();

      this.profileForm = formBuilder.group({
        firstName: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(200), Validators.required])],
        lastName: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(200), Validators.required])],
        phone: ['', Validators.compose([Validators.minLength(11), Validators.maxLength(11), Validators.required])],
      });
    }

  ionViewDidEnter() {
  }

  save(){
    if (!this.profileForm.valid){
      console.log(this.profileForm.value);
    } else {
      let loading = this.loadingCtrl.create({
        content: 'Finalizing..'
      });
    
      loading.present();

      if (this.currentUser.IsPassenger) {
        var passengerModel = new PassengerProfileModel()
         passengerModel.setProfile(this.profileForm.value.firstName
        , this.profileForm.value.lastName
        , this.profileForm.value.phone
        , this.profileForm.value.profileId
        , this.currentUser.Id);

        this.profile.AddPassengerDetails(passengerModel).then(success =>{
            loading.dismiss().then(suc =>{
            this.stB.show();
            this.navCtrl.setRoot('ClientIndexPage')
          })
          });
      }

      if (!this.currentUser.IsPassenger) {
        var driverModel = new DriverProfileModel()
        driverModel.setProfile(this.profileForm.value.firstName
        , this.profileForm.value.lastName
        , this.profileForm.value.phone
        , this.profileForm.value.profileId
        , this.currentUser.Id);

        this.profile.AddDriverDetails(driverModel).then(success =>{
            loading.dismiss().then(suc =>{
            this.stB.show();
            this.navCtrl.setRoot('DriverIndexPage')
          })
          });
      }
    }
  }


}
