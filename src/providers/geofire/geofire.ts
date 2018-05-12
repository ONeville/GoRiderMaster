import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';
import * as GeoFire from "geofire";
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { DriverPoolModel, DriverPoolService } from '../../models/driver/driverPool';
/*
  Generated class for the GeofireProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GeofireProvider {
  dbRef: any;
  geoFire: any;
  public hits = new BehaviorSubject([])
  
  constructor() {
    // let dbRefDb = firebase.database().ref();
    // this.geoFire = new GeoFire(dbRefDb);

    let dbRefDbX = firebase.database().ref();
    var riderPool = dbRefDbX.child('driverPoolModel');
    this.geoFire = new GeoFire(riderPool);
  }

     /// Adds GeoFire data to database
  setLocation(key:string, coords: Array<number>) {
    this.geoFire.set(key, coords)
              .then(_ => console.log('location updated'))
              .catch(err => console.log(err))
  }
 
    setDriverLocation(driver: DriverPoolModel) {

      this.geoFire.set(driver)
          .then(_ => console.log('location updated'))
          .catch(err => console.log(err))
    }

    getDriversOnService(radius: number, coords: Array<number>) {
      this.geoFire.query({
        center: coords,
        radius: radius
      })
      .on('key_entered', (key, location, distance) => {
        let hit = {
          location: location,
          distance: distance
        }
  
        let currentHits = this.hits.value
        currentHits.push(hit)
        this.hits.next(currentHits)
      })
     }
 
    /// Queries database for nearby locations
    /// Maps results to the hits BehaviorSubject
    getLocations(radius: number, coords: Array<number>) {
     this.geoFire.query({
       center: coords,
       radius: radius
     })
     .on('key_entered', (key, location, distance) => {
       let hit = {
         location: location,
         distance: distance
       }
 
       let currentHits = this.hits.value
       currentHits.push(hit)
       this.hits.next(currentHits)
     })
    }
}
