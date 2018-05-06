import { Component } from '@angular/core';
import { 
  NavController, 
  Loading,
  LoadingController,
  AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from '../../validators/email';
import { IonicPage } from 'ionic-angular';
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

  
  userTypes: any = [
    { label: 'Are you passenger ?', value: true },
    { label: 'Are you driver ?', value: false }
  ]

  constructor(public navCtrl: NavController,  
    public formBuilder: FormBuilder, 
    public loadingCtrl: LoadingController, 
    public userProfile: Profile02Provider, 
    public alertCtrl: AlertController, 
    private authV2: Auth02Provider) {

      this.signupForm = formBuilder.group({
        email: ['pass00@mail.com', Validators.compose([Validators.required, EmailValidator.isValid])],
        password: ['passs123', Validators.compose([Validators.minLength(6), Validators.required])],
        isPassenger: [true, Validators.compose([Validators.required])],
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
    if (this.signupForm.valid){
        if (this.signupForm.value.isPassenger) {
          this.authV2.AddPassengerLogin(this.signupForm.value.email, this.signupForm.value.password)
          .then(() => {
            this.loading.dismiss().then( () => { 
              this.navCtrl.push('UserProfilePage'); 
            });
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

        if (!this.signupForm.value.isPassenger) {
          this.authV2.AddDriverLogin(this.signupForm.value.email, this.signupForm.value.password)
          .then(() => {
              this.loading.dismiss().then( () => { 
                this.navCtrl.push('UserProfilePage'); });
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
