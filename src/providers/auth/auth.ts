import { Injectable } from '@angular/core';
import  firebase from 'firebase';
import { Platform } from 'ionic-angular';

import { UserLoginModel } from '../../models/userLoging';
// import { UserModel } from '../../models/model';

@Injectable()
export class AuthProvider {
  public fireAuth:firebase.auth.Auth;
  public userProfileRef:firebase.database.Reference;
  public userRef:firebase.database.Reference;
  public passengerRef:firebase.database.Reference;
  private currentUser: firebase.User;

  public dbRef:firebase.database.Reference;

  
  constructor(public platform: Platform) {
    
    this.userProfileRef = firebase.database().ref('/userProfile');
    
     this.userRef = firebase.database().ref('/userModel');
     this.passengerRef = firebase.database().ref('/passengerModel');
     firebase.auth().onAuthStateChanged((user: firebase.User) => this.currentUser = user);
  }

  createUser(email, password) {
    var user = new UserLoginModel()
    user.setUser(email, password);
    var addUSer = this.userRef.push(user.getUser())
    user.setUser('email', 'passw0000004445777');

    this.userRef.ref.on('value', function (snap) {
      
    })

    return this.userRef.child('path0').update(user.getUser())
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

  signupUser(email: string, password: string): Promise<any> {
    return  firebase.auth().createUserWithEmailAndPassword(email, password).then( newUser => {
      this.userProfileRef.child(newUser.uid).set({
        email: email
      });
    });
  }

  resetPassword(email: string): Promise<void> {
    return  firebase.auth().sendPasswordResetEmail(email);
  }

  logoutUser(): Promise<void> {
    this.userProfileRef.child( firebase.auth().currentUser.uid).off();
    return  firebase.auth().signOut();
  }


  get authenticated(): boolean {
    return this.currentUser !== null;
  }

  signOut(): void {
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

  