import {Component, NgZone} from '@angular/core';
import { ViewController, NavParams} from 'ionic-angular';
declare let google;
import { IonicPage } from 'ionic-angular';
@IonicPage()
@Component({
  templateUrl: 'autocomplete.html'
})

export class AutocompletePage {
  autocompleteItems;
  autocomplete;
  label: string;
  service = new google.maps.places.AutocompleteService();

  constructor (public viewCtrl: ViewController, public params: NavParams, private zone: NgZone) {
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
      { input: this.autocomplete.query, componentRestrictions: { country: this.params.get('country') } }, (predictions, status) => {
      me.autocompleteItems = []; 
      me.zone.run( () => {
        predictions.forEach( (prediction) => {
          me.autocompleteItems.push(prediction.description);
        });
      });
    });
  }
}