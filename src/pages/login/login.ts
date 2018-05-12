import { Component } from '@angular/core';
import {
  Loading,
  Platform,
  LoadingController, 
  NavController,
  AlertController, MenuController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { EmailValidator } from '../../validators/email';
import { IonicPage } from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';

import { Auth02Provider } from '../../providers/auth/auth02';
import { Profile02Provider } from '../../providers/profile/profile02';
import { UserType } from '../../models/enums';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public loginForm: FormGroup;
  loading: Loading;
  public initState: boolean =  false;
  public rootPage: string = 'ClientIndexPage';

  constructor(public navCtrl: NavController, 
    public platform: Platform, 
    public diagnostic: Diagnostic, 
    public menu: MenuController, 
    public loadingCtrl: LoadingController, 
    public alertCtrl: AlertController, 
    public formBuilder: FormBuilder, 
    public auth02Provider: Auth02Provider,
    public profile02Provider: Profile02Provider) {
      menu.swipeEnable(false, 'menu1');
      this.loginForm = formBuilder.group({
        email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
        password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
      });

  }

  ionViewDidLoad(){
 }

  login(){
    if (this.loginForm.valid){     
      this.auth02Provider.loginUser(this.loginForm.value.email, this.loginForm.value.password)
      .then( authData => {
        this.loading.dismiss().then( () => {
          var profile = this.profile02Provider.getUserProfile();
          if (!profile) {
            return;
          }
          
          if (profile.IsPassenger) {
            this.auth02Provider.keepAuthe(UserType.Client.toString(), profile.Id);
            this.rootPage = 'ClientIndexPage'
            this.navCtrl.setRoot('ClientIndexPage');            
          } else {
            this.auth02Provider.keepAuthe(UserType.Driver.toString(), profile.Id);
            this.rootPage = 'DriverIndexPage'
            this.navCtrl.setRoot('DriverIndexPage');            
          }
        });
      }, error => {
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
      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }
  }
  
  goToSignup() {
    this.navCtrl.setRoot('SignupPage')
    // this.navCtrl.push('LoginEntrancePage');
  }

  goToResetPassword() {
    this.navCtrl.push('ResetPasswordPage');
  }

  

}
