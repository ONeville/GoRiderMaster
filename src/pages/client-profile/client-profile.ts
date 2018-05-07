import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { Profile02Provider } from '../../providers/profile/profile02';
import { Auth02Provider } from '../../providers/auth/auth02';
import { UserLoginModel } from '../../models/userLoging';
import { PassengerProfileModel } from '../../models/passengerProfile';
/**
 * Generated class for the ClientProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-client-profile',
  templateUrl: 'client-profile.html',
})
export class ClientProfilePage {
  userProfile: UserLoginModel
  passengerProfile: PassengerProfileModel

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public alertCtrl: AlertController,
    private profileProvider: Profile02Provider, 
    private authProvider: Auth02Provider) {
      this.userProfile = this.profileProvider.getUserProfile();
      this.passengerProfile = this.profileProvider.getPassenger();
  }

  ionViewDidLoad() {
  }
  ionViewDidEnter() {
    // this.ph.getUserProfile().on('value', userProfileSnapshot => {
    //   this.userProfile = userProfileSnapshot.val();
    //   this.phoneNumber = userProfileSnapshot.val().phoneNumber;
    //   this.home = userProfileSnapshot.val().home;
    //   this.work = userProfileSnapshot.val().work;
      
    // });
  }
  updateNumber(){
    const alert = this.alertCtrl.create({
      message: "Your New Number",
      inputs: [
        {
         
          value: String(this.passengerProfile.Phone)
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            console.log(data)
            //this.ph.UpdateNumber(data);
          }
        }
      ]
    });
    alert.present();
  }

  logOut(): void {
    this.authProvider.logoutUser().then(() => {
      this.navCtrl.setRoot('LoginPage');
    });
  }
}
