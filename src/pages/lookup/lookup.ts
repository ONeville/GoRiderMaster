import { Component } from '@angular/core';
import { ModalController, IonicPage, NavController, NavParams } from 'ionic-angular';

import { ModalContentPage } from './driver-detail';
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
  cars:any = []
  showDetail: boolean = false
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {

  }

  ionViewDidLoad() {
    this.loadCars();
  }

  loadCars(){
    this.cars.push({ label: 'Marty McFly', description: 'Alfa Romeo - 156 Sportwagon', price: 0.52, distance: 2, time: 1})
    this.cars.push({ label: 'Gaello Tez', description: 'Cadillac - S-Type"', price: 0.52, distance: 2.6, time: 2 })
    this.cars.push({ label: 'Donald Fox', description: 'Ferrari - 190 E', price: 0.52, distance: 2.8, time: 3 })
    this.cars.push({ label: 'Serge Kabs', description: 'Hyundai - H 350', price: 0.52, distance: 3.1, time: 4 })
    this.cars.push({ label: 'Kamunga Juelliete', description: 'Lamborghini - GALLARDO', price: 20.52, distance: 3.5, time: 5 })
  }

  viewDetail(item){
    this.showDetail = !this.showDetail
  }

  requestRide(item){
    // let characterNum = {charNum: 0}
    let modal = this.modalCtrl.create(ModalContentPage, { data: item});
    modal.present();
  }

  closeDetails(){
    this.showDetail = false;
  }
}
