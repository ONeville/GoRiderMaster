import { Component } from '@angular/core';
import {
  Loading,
  Platform,
  LoadingController, 
  NavController,
  AlertController, MenuController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { EmailValidator } from '../../validators/email';
import { AuthProvider } from '../../providers/auth/auth';
import { IonicPage } from 'ionic-angular';
import { ProfileProvider } from '../../providers/profile/profile';
import { NativeMapContainerProvider } from '../../providers/map-native-container/map-native-container';
import { Diagnostic } from '@ionic-native/diagnostic';

// import { UserLoginModel } from '../../models/userLoging';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public loginForm: FormGroup;
  loading: Loading;
  public initState: boolean =  false;

  constructor(public navCtrl: NavController, public ntP: NativeMapContainerProvider,  public platform: Platform, public diagnostic: Diagnostic, public menu: MenuController, public loadingCtrl: LoadingController, 
    public alertCtrl: AlertController, public authProvider: AuthProvider, public ph: ProfileProvider,
    public formBuilder: FormBuilder) {
      menu.swipeEnable(false, 'menu1');
      this.loginForm = formBuilder.group({
        email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
        password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
      });

  }

  ionViewDidLoad(){
  this.checkForGPS()
 }

  checkForGPS(){
   this.ntP.checkGps();
  }

  checkerLogin() { 
    // console.log('Test Loger');
    this.authProvider.createUser('terttt@mail.com', '000125ss')
    .then( authData => {
      console.log(authData);
    }, error => { console.log(error); });

  }
  queryLogin() { 
    // console.log('Test Loger');
    this.authProvider.queryUser();

  }
  
  loginUser() {
    if (!this.loginForm.valid){
      console.log(this.loginForm.value);
    } else {      
      this.authProvider.loginUser(this.loginForm.value.email, this.loginForm.value.password)
      .then( authData => {
        this.loading.dismiss().then( () => {
          this.ph.getUserProfile().on('value', userProfileSnapshot => {
            let phone = userProfileSnapshot.val().phoneNumber
              if (phone == null)
              this.navCtrl.setRoot('StartupPage');
              else
              this.navCtrl.setRoot('HomePage');
          })
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

  goToSignup(): void {
    this.navCtrl.push('LoginEntrancePage');
  }

  goToResetPassword(): void {
    this.navCtrl.push('ResetPasswordPage');
  }

  

}
