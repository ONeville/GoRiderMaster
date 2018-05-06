import {Component, NgZone} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ViewController, NavParams} from 'ionic-angular';
declare let google;
import { IonicPage } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  templateUrl: 'autocomplete.html'
})

export class AutocompletePage {
  autocompleteItems;
  autocomplete;
  label: string;
  service = new google.maps.places.AutocompleteService();
  countryService: Observable<any>;
  countryModel: any;

  constructor (public viewCtrl: ViewController, public params: NavParams, private zone: NgZone, private httpClient: HttpClient) {
    this.getGeoCountry();
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };

    let labelType = this.params.get('labelIndex')

    if (labelType == 1) {
      this.label = 'Search pickup location'
    } else {
      this.label = 'Search destination'
    }
  }
  getGeoCountry(){
    this.countryService = this.httpClient.get('http://ipinfo.io');
    this.countryService
    .subscribe(data => {
      // console.log('my data: ', data);
      this.countryModel = data;
    })
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

  chooseItem(item: any) {
    this.viewCtrl.dismiss(item);
  }

  updateSearch() {
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    let me = this;
    this.service.getPlacePredictions(
      { input: this.autocomplete.query, componentRestrictions: { country: this.countryModel.country  } }, (predictions, status) => {
      me.autocompleteItems = []; 
      me.zone.run( () => {
        predictions.forEach( (prediction) => {
          me.autocompleteItems.push(prediction.description);
        });
      });
    });
  }
}