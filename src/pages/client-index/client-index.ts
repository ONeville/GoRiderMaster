import { Component, AfterViewInit } from '@angular/core';
import { NavController, NavParams, MenuController, ModalController, Platform, AlertController, LoadingController } from 'ionic-angular';
import { IonicPage } from 'ionic-angular';
import { EventProvider } from '../../providers/event/event';
import { MapContainerProvider } from '../../providers/map-container/map-container';
import { NativeMapContainerProvider } from '../../providers/map-native-container/map-native-container';
import { Profile02Provider } from '../../providers/profile/profile02';
import { AnimControlProvider } from '../../providers/anim-control/anim-control';
import { PopUpProvider } from '../../providers/popup/popup';
import { DirectionProvider } from '../../providers/direction/direction';
import { NotificationProvider } from '../../providers/notification/notification';
import { GeocoderProvider } from '../../providers/geocoder/geocoder';
import { Geolocation } from '@ionic-native/geolocation';
import * as firebase from 'firebase/app';
import { Storage } from '@ionic/storage';
import { GeofireProvider } from '../../providers/geofire/geofire';
import { Diagnostic } from '@ionic-native/diagnostic';
import { StatusBar } from '@ionic-native/status-bar';
declare var google;

import { Auth02Provider } from '../../providers/auth/auth02';
import { PassengerProfileModel } from '../../models/passengerProfile';
import { UtilsServices } from '../../models/model';



@IonicPage()
@Component({
  selector: 'page-client-index',
  templateUrl: 'client-index.html',
  providers: [Profile02Provider, AnimControlProvider, PopUpProvider, GeocoderProvider ],
})
export class ClientIndexPage {

  currentLocationControl: any = {
    id: 1,
    label: 'Your location',
    icon: 'md-locate'
  }
  destinationLocationControl: any = {
    id: 2,
    label: 'Choose Destination',
    icon: 'md-pin'
  }
  userProfile: any;
  passengerModel: PassengerProfileModel;
  onRequest: boolean = false

  locationLatLng: any;
  destinationLatLng: any;
  geocoder: any = new google.maps.Geocoder;
  utils: UtilsServices;

  constructor(public navCtrl: NavController, public navParams: NavParams
    , private profileProvider: Profile02Provider
    , private stattusBar: StatusBar
    , private modalCtrl: ModalController
    , private geoFire: GeofireProvider
    ) {
      this.utils = new UtilsServices()
  }

  ionViewDidLoad() {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.navCtrl.setRoot('LoginEntrancePage');
        unsubscribe();
        this.stattusBar.hide(); 
      }else{
        unsubscribe(); 
        //this.userProfile = firebase.database().ref(`userProfile/${user.uid}`);
        this.passengerModel = this.profileProvider.getPassenger();
    }
    });
  }

  refreshProfile(){
    // this.profileProvider.refleshProfile();
    // console.log(this.profileProvider.getUserProfile());
    
    //this.profileProvider.refleshProfile();
    // this.profileProvider.userConfig = this.profileProvider.getPassenger();
  }

  showAddressModal (selectedBar) {
    let modal = this.modalCtrl.create('AutocompletePage', { labelIndex: selectedBar });
    modal.onDidDismiss(data => {
      //this.address.place = data;
    if (selectedBar == 1 && data != null){
      this.currentLocationControl = {
        id: 1,
        label: data,
        icon: 'md-locate'
      }
      this.geocoder.geocode( { 'address': data}, (results, status) => {
        if (status == 'OK') {
          this.locationLatLng = results[0].geometry.location;
        } else { alert('Geocode was not successful for the following reason: ' + status); }
      });
    }
    if (selectedBar == 2 && data != null){
      this.destinationLocationControl = {
        id: 2,
        label: data,
        icon: 'md-pin'
      }
      this.onRequest = true;
      this.geocoder.geocode( { 'address': data}, (results, status) => {
        if (status == 'OK') {
          this.destinationLatLng = results[0].geometry.location;
          this.onRequest = true;
        } else {
         alert('Geocode was not successful for the following reason: ' + status);
        }
      });
      
    }
    });
    modal.present();
  }


  findDrivers(){
    // this.onDriverRequest = !this.onDriverRequest;

    let startLatLng = this.locationLatLng
    let destLatLng = this.destinationLatLng
    let locationLb = this.utils.getID();

     if (startLatLng === undefined){
         if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position)=>{

            var crd = position.coords;
            startLatLng = {
              lat:crd.latitude,
              lng: crd.longitude
            }
            
            this.geoFire.setLocation(locationLb, [crd.latitude, crd.longitude])
  
            let data = {
              current : startLatLng,
              destination: destLatLng
            }
  
            this.navCtrl.push('LookupPage', { locations: data });
  
          }, ()=>{ console.warn(`ERROR: geolocation`);});

         }

      }else{
        let data = {
          current : startLatLng,
          destination: destLatLng
        }
        this.geoFire.setLocation(locationLb, [startLatLng.lat(), startLatLng.lng()])
        //console.log('XY: ' + JSON.stringify(data));
        this.navCtrl.push('LookupPage', { locations: data });
      }
  }

}
