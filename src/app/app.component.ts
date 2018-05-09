import { Component, ViewChild, NgZone, OnInit } from '@angular/core';
import { Platform, Nav, Loading, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { OneSignal } from '@ionic-native/onesignal';
import * as firebase from 'firebase/app';

import { Auth02Provider } from '../providers/auth/auth02';
import { Profile02Provider } from '../providers/profile/profile02';

import { UserLoginModel } from '../models/userLoging';
// import { PassengerProfileModel } from '../models/passengerProfile';
// import { DriverProfileModel } from '../models/driverProfile';

@Component({
  templateUrl: 'app.html'
})

export class MyApp implements OnInit {

  public user: any;
  @ViewChild(Nav) nav: Nav;
  public fireAuth:firebase.auth.Auth;
  public rootPage: string = 'ClientIndexPage';
  phone: any;
  pages: Array<{ title: string, component: any, icon: string }>

  photoURL: string
  
  constructor(public zone: NgZone,  public loadingCtrl: LoadingController, private One: OneSignal, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public profile02: Profile02Provider,  private authO2: Auth02Provider) {
    this.initializeApp();
  }

  ngOnInit(): void {
    this.pages = [
      { title: 'Promo', component: 'PromoPage', icon: "trophy" },
      { title: 'History', component: 'HistoryPage', icon: "clock" },
      { title: 'Payment', component: 'PaymentPage', icon: "card" },
      { title: 'Support', component: 'SupportPage', icon: "help-circle" },
      { title: 'About', component: 'AboutPage', icon: "information-circle" }
    ];
  }

  initializeApp() {
  this.platform.ready().then(() => {
    if (this.platform.is('cordova')) {
    this.One.startInit("61ee0e36-8694-4ec8-9436-29982b7f8d57", "890704209838");
    this.One.inFocusDisplaying(this.One.OSInFocusDisplayOption.Notification);
    this.One.setSubscription(true);
    this.One.endInit();  
    this.statusBar.styleDefault();
    this.statusBar.backgroundColorByHexString("#BBBBBB");
    setTimeout(() => {
      this.splashScreen.hide();
    }, 500);
    
  }
  });
}


  openPage(page) {
    this.nav.push(page.component);
  }

  gotoProfile(){
    var profile = this.profile02.getUserProfile();
    this.nav.push('UserIdentityPage', { paramData: "edit" });
  }

  logOut() {
    this.authO2.logoutUser().then(() => {
      this.nav.push('LoginPage');
      //this.navCtrl.setRoot('LoginPage');
    });
  }
}