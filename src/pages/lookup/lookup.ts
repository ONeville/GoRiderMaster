import { Component } from '@angular/core';
import { ModalController, IonicPage, NavController, NavParams } from 'ionic-angular';

import { ModalContentPage } from './driver-detail';
import { GeofireProvider } from '../../providers/geofire/geofire';

/**
 * Generated class for the LookupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lookup',
  templateUrl: 'lookup.html',
})
export class LookupPage {
  cars:any = [];
  showDetail: boolean = false;
  locations: any;
  destination: any;
  lat: number;
  lng: number;
  markers: any;
  subscription: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public geoFire: GeofireProvider) {
    this.locations = this.navParams.get('locations')
  }

  ionViewDidLoad() {
    this.loadCars();
    // this.getLocation(this.locations.current.lat, this.locations.current.lng)
    // // this.getUserLocation()
    // this.subscription = this.geoFire.hits
    //     .subscribe(hits => {
    //       this.markers = hits
    //       console.log('HITS: ' + JSON.stringify(hits));
    //     })
  }

  loadCars(){
    this.cars.push({ label: 'Marty McFly', description: 'Alfa Romeo - 156 Sportwagon', price: 0.52, distance: 2, time: 1})
    this.cars.push({ label: 'Gaello Tez', description: 'Cadillac - S-Type"', price: 0.52, distance: 2.6, time: 2 })
    this.cars.push({ label: 'Donald Fox', description: 'Ferrari - 190 E', price: 0.52, distance: 2.8, time: 3 })
    this.cars.push({ label: 'Serge Kabs', description: 'Hyundai - H 350', price: 0.52, distance: 3.1, time: 4 })
    this.cars.push({ label: 'Kamunga Juelliete', description: 'Lamborghini - GALLARDO', price: 20.52, distance: 3.5, time: 5 })
  }

  viewDetail(item){

    let modal = this.modalCtrl.create(ModalContentPage, { data: item, location: this.locations.current});
    modal.present();

    // let geocoder = new google.maps.Geocoder;
    // geocoder.geocode( { 'address': this.locations}, (results, status) => {
    //   if (status == 'OK') {
    //     let dd = results[0].geometry.location;
    //     let modal = this.modalCtrl.create(ModalContentPage, { data: item, location: dd});
    //     modal.present();
    //   } else {
    //    alert('Geocode was not successful for the following reason: ' + status);
    //   }
    // });
    
  }

  requestRide(item){
    this.showDetail = !this.showDetail
  }

  // seedDatabase() {
  //   let dummyPoints = [
  //     [37.9, -122.1],
  //     [38.7, -122.2],
  //     [38.1, -122.3],
  //     [38.3, -122.0],
  //     [38.7, -122.1]
  //   ]
  
  //   dummyPoints.forEach((val, idx) => {
  //     let name = `dummy-location-${idx}`
  //     console.log(idx)
  //     this.geoFire.setLocation(name, val)
  //   })
  // }
  getLocation(lat, lng) {
    /// locate the user
    this.geoFire.getLocations(100, [lat, lng])
    console.log('HITS GET: ' + JSON.stringify(this.geoFire.hits));

  }
  getUserLocation() {
    /// locate the user
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.geoFire.getLocations(100, [this.lat, this.lng])
      });
    }
  }

  closeDetails(){
    this.showDetail = false;
  }
}
