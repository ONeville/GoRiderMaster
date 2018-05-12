import { Injectable } from '@angular/core';
import  firebase from 'firebase';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { UserLoginModel } from '../../models/userLoging';

@Injectable()
export class Auth02Provider {
  private fireAuth:firebase.auth.Auth;
  private userRef:firebase.database.Reference;
  private passengerRef:firebase.database.Reference;
  private driverRef:firebase.database.Reference;
  private currentUser: firebase.User;

  
  constructor(public platform: Platform, private storage: Storage) {
     this.userRef = firebase.database().ref('/userModel');
     this.passengerRef = firebase.database().ref('/passengerModel');
     this.driverRef = firebase.database().ref('/driverModel');
     firebase.auth().onAuthStateChanged((user: firebase.User) => this.currentUser = user);
  }

  AddPassengerLogin(email, password) {
    var user = new UserLoginModel()
    user.setPassengerUser(email);
    return  firebase.auth().createUserWithEmailAndPassword(email, password).then( newUser => {
      this.userRef.child(newUser.uid).set(user.getUser());
    });
  }

  AddDriverLogin(email, password) {
    var user = new UserLoginModel()
    user.setDriverUser(email);
    return  firebase.auth().createUserWithEmailAndPassword(email, password).then( newUser => {
      this.userRef.child(newUser.uid).set(user.getUser());
    });
  }


  queryUser() {
    var user;
    this.userRef.ref.on('value', function (snap) {
      user = snap.val();
      console.log(user);
      
    })
  }

  loginUser(email: string, password: string): Promise<any> {
    return  firebase.auth().signInWithEmailAndPassword(email, password);
  }

  resetPassword(email: string): Promise<void> {
    return  firebase.auth().sendPasswordResetEmail(email);
  }

  logoutUser(): Promise<void> {
    this.userRef.child( firebase.auth().currentUser.uid).off();
    return  firebase.auth().signOut();
  }


  clearSession() {
    this.storage.clear().then(() => { console.log('all keys cleared'); });
  }


  // authenticated(key) {
  //   //.then((value) => {})
  //   return this.storage.get(key);
  // }

  keepAuthe(key, valaue) {
    this.storage.set(key, valaue);
  }

  // detachAuthe(key) {
  //   this.storage.remove(key);
  // }

  signOut(): void {
    this.clearSession()
    firebase.auth().signOut();
  }

  displayName(): string {
    if (this.currentUser !== null) {
      return this.currentUser.displayName;
    } else {
      return '';
    }
  }

  }

  