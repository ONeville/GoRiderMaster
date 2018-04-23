import { Component } from '@angular/core';
import { Platform, NavParams, ViewController } from 'ionic-angular';

@Component({
    selector: 'modal-detail',
    templateUrl: 'driver-detail.html',
  })
  export class ModalContentPage {
    character;
  
    constructor(
      public platform: Platform,
      public params: NavParams,
      public viewCtrl: ViewController
    ) {

    let data = this.params.get('data')
    
      this.character = {
        name: data.label,
        quote: data.description,
        image: 'assets/img/car_vip.png',
        items: [
          { title: 'Price', note: data.price + ' per mile' },
          { title: 'Distance', note: data.distance + 'miles' },
          { title: 'Time', note: data.time + ' min' }
        ]
      };
    }
  
    dismiss() {
      this.viewCtrl.dismiss();
    }
  }