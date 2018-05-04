import { Component } from '@angular/core';
import { 
  NavController, 
  Loading,
  LoadingController,
  AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';
import { IonicPage } from 'ionic-angular';

// import { ProfileProvider } from '../../providers/profile/profile';


import { Auth02Provider } from '../../providers/auth/auth02';
import { Profile02Provider } from '../../providers/profile/profile02';


@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  public signupForm: FormGroup;
  loading: Loading;
  
  constructor(public navCtrl: NavController, public authProvider: AuthProvider, 
    public formBuilder: FormBuilder, public loadingCtrl: LoadingController,public userProfile: Profile02Provider, 
    public alertCtrl: AlertController, private authV2: Auth02Provider) {

      this.signupForm = formBuilder.group({
        email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
        password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
        isPassenger: true
      });
    }

  signupUser(){
    // if (!this.signupForm.valid){
    //   console.log(this.signupForm.value);
    // } else {
    //   this.authProvider.signupUser(this.signupForm.value.email, this.signupForm.value.password)
    //   .then(() => {
    //     this.loading.dismiss().then( () => {
    //       if (this.ph.phone == null)
    //         this.navCtrl.push('StartupPage');
    //         else
    //         this.navCtrl.setRoot('HomePage');
    //     });
    //   }, (error) => {
    //     this.loading.dismiss().then( () => {
    //       let alert = this.alertCtrl.create({
    //         message: error.message,
    //         buttons: [
    //           {
    //             text: "Ok",
    //             role: 'cancel'
    //           }
    //         ]
    //       });
    //       alert.present();
    //     });
    //   });
    //   this.loading = this.loadingCtrl.create();
    //   this.loading.present();
    // }
  }


  createUser(){
    if (!this.signupForm.valid){
      console.log(this.signupForm.value);
    } else {
        if (this.signupForm.value.isPassenger.indexOf("5") > 0) {
          this.authV2.AddPassengerLogin(this.signupForm.value.email, this.signupForm.value.password)
          .then(() => {
            this.loading.dismiss().then( () => { this.navCtrl.push('UserProfilePage'); });
          }, (error) => { 
            this.loading.dismiss().then( () => {
              let alert = this.alertCtrl.create({
                message: error.message,
                buttons: [
                  {
                    text: "Ok",
                    role: 'cancel'
                  }
                ]
              });
              alert.present();
            });
          });
        }

        if (this.signupForm.value.isPassenger.indexOf("6") > 0) {
          this.authV2.AddDriverLogin(this.signupForm.value.email, this.signupForm.value.password)
          .then(() => {
              this.loading.dismiss().then( () => { this.navCtrl.push('UserProfilePage'); });
          }, (error) => { 
            this.loading.dismiss().then( () => {
              let alert = this.alertCtrl.create({
                message: error.message,
                buttons: [
                  {
                    text: "Ok",
                    role: 'cancel'
                  }
                ]
              });
              alert.present();
            });
          });
        }

        this.loading = this.loadingCtrl.create();
        this.loading.present();
    }
  }


  goToLogin(){
    this.navCtrl.setRoot('LoginPage');
  }

}
