import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Storage } from '@ionic/storage';

import { UserLoginModel } from '../../models/userLoging';
import { UserType } from '../../models/enums';
import { PassengerProfileModel } from '../../models/client/passengerProfile';
import { DriverProfileModel } from '../../models/driver/driverProfile';

@Injectable()
export class Profile02Provider {

  private userModel: UserLoginModel;
  private passengerModel: PassengerProfileModel;
  private driverModel: DriverProfileModel;

  constructor(private storage: Storage) {
    this.initAuth();
  }

  initAuth(){
    firebase.auth().onAuthStateChanged( user => {
      if (user) {
        this.initUser(user.uid);

        // console.log('Checker: ' + this.userModel.IsPassenger);

        // if (this.userModel.IsPassenger) {
        //   this.initPassenger(user.uid);
        // }
        // if (!this.userModel.IsPassenger) {
        //   this.initDriver(user.uid);
        // }
      }
    });
  }
  authenticated(key) {
    //.then((value) => {})
    // var profile = this.storage.get(UserType.Driver.toString()) || this.storage.get(UserType.Client.toString())
    // if (profile) {
    //   profile.then((value) => {
    //     // var json = '{"result":true, "count":42}';
    //     var obj = JSON.parse(value);
    //     this.initUser(value);
    //   });
    // }

    this.storage.get(key).then((value) => {  this.initUser(value);   });
  }

  keepAuthe(key, valaue) {
    this.storage.set(key, valaue);
  }

  detachAuthe(key) {
    this.storage.remove(key);
  }
  clear() {
    this.storage.clear().then(() => { console.log('all keys cleared'); });
  }

  initUser(id){
    var userLogged = firebase.database().ref(`userModel/${id}`);
    userLogged.on('value', snap => {
      if (!snap.exists()) {
        return;
      }
     this.userModel = new UserLoginModel()
     this.userModel.setUser(id, snap.val().email, snap.val().isPassenger, snap.val().displayName);
      if (snap.val().isPassenger) {
        this.initPassenger(id);        
      } else {
        this.initDriver(id);        
      }

    })
  }

  initPassenger(id){
    var userLogged = firebase.database().ref(`passengerModel/${id}`);
    userLogged.on('value', snap => {
     this.passengerModel = new PassengerProfileModel()
      if (snap.val()) {
        this.passengerModel.setProfile(snap.val().firstName
        , snap.val().lastName
        , snap.val().phone
        , snap.val().profileId
        , id);
      }
    })
  }

  initDriver(id){
    var userLogged = firebase.database().ref(`driverModel/${id}`);
    userLogged.on('value', snap => {
      this.driverModel = new DriverProfileModel()
      if (snap.val()) {        
        this.driverModel.setProfile(snap.val().firstName
        , snap.val().lastName
        , snap.val().phone
        , snap.val().profileId
        , id);
      }
    })
  }

  AddPassengerDetails(passenger:PassengerProfileModel){
    // var userLogged = firebase.database().ref(`driverModel/${id}`);
    var passengerModel = firebase.database().ref('/passengerModel');
    return passengerModel.child(this.userModel.Id).set(passenger.getProfile());
  }

  AddDriverDetails(driver:DriverProfileModel){
    // var userLogged = firebase.database().ref(`driverModel/${id}`);
    var driverModel = firebase.database().ref('/driverModel');
    return driverModel.child(this.userModel.Id).set(driver.getProfile());
  }

  refleshProfile(id){
    this.initUser(id);
    if (this.userModel.IsPassenger) {
      this.initPassenger(this.userModel.Id);
    }
    if (!this.userModel.IsPassenger) {
      this.initDriver(this.userModel.Id);
    }
  }

  getUserProfile() {

    return this.userModel;
  }

  getPassenger() {
    return this.passengerModel;
  }

  getDriver() {
    return this.driverModel;
  }

  updateDisplayProfile(id: any, value: string) {
    return firebase.database().ref(`userModel/${id}`).update({
      displayName: value
    });
  }

  RateDriver(id: any, value: boolean): Promise<any> {
    return firebase.database().ref(`Customer/${id}/client`).update({
      Client_HasRated: value
    });
  }

  ApprovePickup(value: boolean, id: any): Promise<any> {
    return firebase.database().ref(`Customer/${id}/client`).update({
      Client_PickedUp: value,
    });
  }

  ApproveDrop(value: boolean, id: any): Promise<any> {
    return firebase.database().ref(`Customer/${id}/client`).update({
      Client_Dropped: value,
    });
  }

  SendMessage(value: string, id: any): Promise<any> {
    return firebase.database().ref(`Customer/${id}/client`).update({
      Client_Message: value,
    });
  }

  CanCharge(value: boolean, id: any): Promise<any> {
    return firebase.database().ref(`Customer/${id}/client`).update({
      Client_CanChargeCard: value,
    });
  }


  
}