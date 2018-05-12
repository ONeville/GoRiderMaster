import { Component, OnInit } from '@angular/core';
import { 
  NavController, 
  NavParams,
  Loading,
  LoadingController,
  AlertController, MenuController  } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { AuthProvider } from '../../providers/auth/auth';
import { IonicPage } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';


import { Profile02Provider } from '../../providers/profile/profile02';

import { UserLoginModel } from '../../models/userLoging';
import { PassengerProfileModel } from '../../models/client/passengerProfile';
import { DriverProfileModel } from '../../models/driver/driverProfile';
import { IdentityProfileService } from '../../models/identityProfile-service'

/**
 * Generated class for the UserIdentityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-identity',
  templateUrl: 'user-identity.html',
})
export class UserIdentityPage implements OnInit {
  public phoneForm: FormGroup;
  public profileForm: FormGroup;
  loading: Loading;
  public currentUser: UserLoginModel;
  onEdit: boolean = false;
  identityProfile: any;

  constructor(public navCtrl: NavController, public stB: StatusBar, public menu: MenuController,  
    public formBuilder: FormBuilder, public loadingCtrl: LoadingController, 
    public alertCtrl: AlertController, private profile: Profile02Provider,
    private navParams: NavParams) {
      menu.swipeEnable(false, 'menu1');
      this.onEdit = navParams.get('paramData') === "edit" ? true : false;
    this.currentUser = this.profile.getUserProfile();
    
    if (!this.currentUser.IsPassenger) {
      this.identityProfile = this.profile.getDriver();
    } else {
      this.identityProfile = this.profile.getPassenger();      
    }

    this.initForm();
  }

  ngOnInit(): void {
    this.onEdit = this.navParams.get('paramData') === "edit" ? true : false;
    this.loadForm();
  }

  initForm() {
    if (!this.onEdit) {
      this.profileForm = this.formBuilder.group({
        firstName: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(200), Validators.required])],
        lastName: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(200), Validators.required])],
        phone: ['', Validators.compose([Validators.minLength(11), Validators.maxLength(11), Validators.required])],
      });
      
    }
  }

  loadForm() {
    if (this.onEdit) {
      this.profileForm = this.formBuilder.group({
        firstName: [this.identityProfile.FirstName, Validators.compose([Validators.minLength(2), Validators.maxLength(200), Validators.required])],
        lastName: [this.identityProfile.LastName, Validators.compose([Validators.minLength(2), Validators.maxLength(200), Validators.required])],
        phone: [this.identityProfile.Phone, Validators.compose([Validators.minLength(11), Validators.maxLength(11), Validators.required])],
      });
    }
  }

  save(){
    if (this.profileForm.valid){
      let loading = this.loadingCtrl.create({
        content: 'Finalizing..'
      });
    
      loading.present();

      if (this.onEdit) {
        this.updateProfile(loading);
      } else {
        this.addProfile(loading);
      }
      this.profile.refleshProfile(this.currentUser.Id);
    }
  }


  addProfile(loading) {
    if (this.currentUser.IsPassenger) {
      var passengerModel = new PassengerProfileModel()
       passengerModel.setProfile(this.profileForm.value.firstName
      , this.profileForm.value.lastName
      , this.profileForm.value.phone
      , this.profileForm.value.profileId
      , this.currentUser.Id);
      
      if (passengerModel.userId.length > 2) {
        this.profile.AddPassengerDetails(passengerModel).then(success =>{
            loading.dismiss().then(suc =>{
            this.profile.updateDisplayProfile(this.currentUser.Id, this.profileForm.value.firstName)
            this.stB.show();
            this.navCtrl.setRoot('LoginPage')
          })
          });
        
      }
    }
    if (!this.currentUser.IsPassenger) {
      var driverModel = new DriverProfileModel()
      driverModel.setProfile(this.profileForm.value.firstName
      , this.profileForm.value.lastName
      , this.profileForm.value.phone
      , this.profileForm.value.profileId
      , this.currentUser.Id);
      if (passengerModel.userId.length > 2) {
        this.profile.AddDriverDetails(driverModel).then(success =>{
            loading.dismiss().then(suc =>{
              this.profile.updateDisplayProfile(this.currentUser.Id, this.profileForm.value.firstName)
            this.stB.show();
            this.navCtrl.setRoot('LoginPage')
          })
          });
        
      }
    }
    this.profile.clear();
  }

  updateProfile(loading) {
    var service = new IdentityProfileService();

    if (this.currentUser.IsPassenger) {
      var passengerModel = new PassengerProfileModel()
      passengerModel.setProfile(this.profileForm.value.firstName
     , this.profileForm.value.lastName
     , this.profileForm.value.phone
     , this.profileForm.value.profileId
        , this.currentUser.Id);
        if (passengerModel.userId.length > 2) {
          service.updateClientProfile(passengerModel).then(success =>{
              loading.dismiss().then(suc =>{ 
                this.profile.updateDisplayProfile(this.currentUser.Id, passengerModel.FirstName);
                this.stB.show();
              })
          });        
        }
    } else {
      var driverModel = new DriverProfileModel()
      driverModel.setProfile(this.profileForm.value.firstName
      , this.profileForm.value.lastName
      , this.profileForm.value.phone
      , this.profileForm.value.profileId
      , this.currentUser.Id);
      if (driverModel.userId.length > 2) {
        service.updateDriverProfile(driverModel).then(success =>{
            loading.dismiss().then(suc =>{ 
              this.profile.updateDisplayProfile(this.currentUser.Id, driverModel.FirstName);
              this.stB.show();
            })
        });        
      }
    }
  }

}
