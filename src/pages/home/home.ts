import { Component, AfterViewInit } from '@angular/core';
import { NavController, MenuController, ModalController, Platform, AlertController, LoadingController } from 'ionic-angular';
import { IonicPage } from 'ionic-angular';
import { EventProvider } from '../../providers/event/event';
import { MapContainerProvider } from '../../providers/map-container/map-container';
import { NativeMapContainerProvider } from '../../providers/map-native-container/map-native-container';
import { ProfileProvider } from '../../providers/profile/profile';
import { AnimControlProvider } from '../../providers/anim-control/anim-control';
import { PopUpProvider } from '../../providers/popup/popup';
import { DirectionProvider } from '../../providers/direction/direction';
import { NotificationProvider } from '../../providers/notification/notification';
import { GeocoderProvider } from '../../providers/geocoder/geocoder';
//import { AutocompletePage } from '../autocomplete/autocomplete';
//import { CallNumber } from '@ionic-native/call-number';
import { Geolocation } from '@ionic-native/geolocation';
import * as firebase from 'firebase/app';
import { Storage } from '@ionic/storage';
import { GeofireProvider } from '../../providers/geofire/geofire';
//import { Vibration } from '@ionic-native/vibration';
//import { RatePage } from '../../pages/rate/rate';
import { Diagnostic } from '@ionic-native/diagnostic';
import { StatusBar } from '@ionic-native/status-bar';
declare var google;


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [NativeMapContainerProvider, MapContainerProvider, ProfileProvider, AnimControlProvider, PopUpProvider, GeocoderProvider ],
})

export class HomePage implements AfterViewInit  {
  address: any;
  userProfile: any;
  public location;
  public plate;
  public carType;
  public name;
  public seat;
  public rating;
  public picture;
  public number;
  public canStopCheck: boolean = false;
  public canStop: boolean = false
  public onGpsEnabled: boolean = true;
  public toggleMore: boolean = false;
  userDestName: any;
  returningUser: boolean = false;
  started: boolean = false;
  NotifyTimes: number = -1;
  timerBeforeNotify: number = 30000;
  timeTonotify: any;
  uid: any
  driverLocationName: any;
  startedNavigation: boolean = false;
  added: boolean = true;
  price: any;

  locationLatLng: any;
  destinationLatLng: any;
  geocoder: any = new google.maps.Geocoder;

  onDriverRequest: boolean = false;

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

  constructor(public storage: Storage, public stB: StatusBar, public geolocation: Geolocation, public loadingCtrl: LoadingController, public diagnostic: Diagnostic, public alert: AlertController,  public cMap: NativeMapContainerProvider, public myGcode: GeocoderProvider, public dProvider: DirectionProvider, public platform: Platform, public modalCtrl: ModalController, public menu: MenuController, public pop: PopUpProvider, public anim: AnimControlProvider, public ph: ProfileProvider, public myMap: MapContainerProvider,  public navCtrl: NavController, public eventProvider: EventProvider, public OneSignal: NotificationProvider, public geoFire: GeofireProvider) {
  menu.swipeEnable(false, 'menu1');
  this.address = {
    place: 'Dallas, TX USA'
  };

}

  ngAfterViewInit() {
    this.platform.ready().then(() => {
      this.cMap.loadMap();
    });
}

  ionViewDidLoad(){
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.navCtrl.setRoot('LoginEntrancePage');
        unsubscribe();
        this.stB.hide(); 
      }else{
        unsubscribe(); 
        this.userProfile = firebase.database().ref(`userProfile/${user.uid}`);
        this.ph.getUserProfile().on('value', userProfileSnapshot => {
        let phone = userProfileSnapshot.val().phoneNumber

        if (phone == null || phone == undefined)
          this.navCtrl.setRoot('PhonePage');
          this.stB.show();
      })
    }
    });
    
  }

  
   toggleMoreBtn(){
    this.toggleMore = this.toggleMore ? false : true
   }

   callDriver(){
     console.log(this.number);
     window.open("tel:" + this.number);
   }


   sendMessage(){
     let id = this.uid
     this.pop.Send(id)
   }


  showAddressModal (selectedBar) {
    clearTimeout(this.cMap.timer1)
    let modal = this.modalCtrl.create('AutocompletePage', { country: this.ph.currentCountry, labelIndex: selectedBar });
    modal.onDidDismiss(data => {
      this.address.place = data;
    if (selectedBar == 1 && data != null){
      if (!this.startedNavigation){
        this.currentLocationControl = {
          id: 1,
          label: data,
          icon: 'md-locate'
        }
        this.geocoder.geocode( { 'address': data}, (results, status) => {
          if (status == 'OK') {
            this.locationLatLng = results[0].geometry.location;
          //  console.log(this.locationLatLng.lat(), this.locationLatLng.lng());
          } else { alert('Geocode was not successful for the following reason: ' + status); }
        });

      }
    }
    if (selectedBar == 2 && data != null){
      this.destinationLocationControl = {
        id: 2,
        label: data,
        icon: 'md-pin'
      }

      this.geocoder.geocode( { 'address': data}, (results, status) => {
        if (status == 'OK') {
          this.destinationLatLng = results[0].geometry.location;
        //  console.log(this.destinationLatLng.lat(), this.destinationLatLng.lng());
        } else {
         alert('Geocode was not successful for the following reason: ' + status);
        }
      });
      
    }
    });
    modal.present();
  }


  CheckForPreviousData(){
    this.storage.get('currentUserId').then((value) => {
    if (value != null){
     this.uid = value;
     this.startWaitingForResponse();
     this.hideFunctions();
     this.returningUser = true;
     this.pop.uid = this.uid;
     this.dProvider.id = this.uid;
    }else{
     this.storage.remove(`currentUserId`);
    }

  }).catch(er=>{console.log("error")});
    
  }

  getLocationUID() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  
  findDrivers(){
    // this.onDriverRequest = !this.onDriverRequest;

    let startLatLng = this.locationLatLng
    let destLatLng = this.destinationLatLng
    let locationLb = this.getLocationUID() + '-C-' + Date.now().toString().replace(' ', '');

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


  hideFunctions(){
    //let bottomBar1 = document.getElementById("bar2").style.display = 'none'
    this.cMap.onbar2 = true
   
    let centerBar = document.getElementById("onbar")
    centerBar.style.display = 'none'
   
    // document.getElementById("destination").innerHTML = 'Set Destination';
    // this.cMap.map.setCameraZoom(6);
    this.startedNavigation = true;
    this.pop.onRequest = true;
    this.cMap.hasRequested = true;
    this.cMap.isCarAvailable = false;
    this.dProvider.calculateBtn = false;
   
    this.ph.getAllDrivers().off("child_added");
    this.ph.getAllDrivers().off("child_changed");
    this.cMap.map.clear();
  }
  
  
  StartListeningForChanges(){
    this.hideFunctions()
    this.returningUser = false;
    var image = this.ph.user.photoURL
    var name = this.ph.user.displayName
    var pay = this.ph.paymentType
    this.pop.calculateBtn = false;
    clearTimeout(this.cMap.timer1)

    if (image == null){
     image = 'https://cdn1.iconfinder.com/data/icons/instagram-ui-glyph/48/Sed-10-128.png'
    }
      
    if (name == null){
      name = this.ph.user.email
    }

    if (pay == null){
      pay = 1
    }

    if (this.cMap.lat == null && this.cMap.lng == null){
      var pos = this.cMap.location;
      this.cMap.lng = pos.lng;
      this.cMap.lat = pos.lat;
    }

    this.createUserInformation(name, image, this.cMap.lat, this.cMap.lng, this.myGcode.locationName, pay  );
  }


  cancelRequest(){
    clearTimeout(this.timeTonotify);
    this.NotifyTimes = -1;
    if (this.pop.allowed)
    this.pop.showAlertComplex('Why Do You Want To Cancel?', 'Please Choose An Option', 'Accept', 'Reject', true)
    this.onDriverRequest = false;
  }


  gotoPayment(){
    this.navCtrl.push('PaymentPage');
  }


  createUserInformation(name: string, picture: any, 
    lat: number, lng: number, locationName: any, payWith: any) {
          this.NotifyTimes++
          let driver_id = this.cMap.car_notificationIds[this.NotifyTimes];
          if (driver_id != null){
          let selected_driver = driver_id.toString();
          console.log(selected_driver);
          this.pop.uid = selected_driver;
          this.dProvider.id = selected_driver;
          this.uid = selected_driver;
          let dest = 'Waiting For Input..';


        let CustomerRef = firebase.database().ref(`Customer/${selected_driver}`);
        return CustomerRef.child("/client").set({
          Client_username: name,
          Client_location: [lat, lng],
          Client_locationName: locationName,
          Client_paymentForm: payWith,
          Client_picture: picture,
          Client_destinationName: dest,
          Client_CanChargeCard: false,
          Client_PickedUp: false,
          Client_Dropped: false,
          Client_HasRated: false
      
        }).then(suc=>{

            this.CreatePushNotification();
        })
      }else{
        clearTimeout(this.timeTonotify);
        this.pop.clearAll(this.uid, true);
        console.log(this.NotifyTimes);
        this.pop.show('All Our Drivers Are Busy, Please Try Again. Sorry For The Incovenience.')
        this.NotifyTimes = -1;
      }
    
  }


  CreatePushNotification(){
      let current_id = this.cMap.car_notificationIds[this.NotifyTimes]

        if (this.platform.is('cordova'))
          //console.log(current_id);  
          this.OneSignal.sendPush(current_id)

      console.log(this.cMap.car_notificationIds.length, this.NotifyTimes)
      if ( this.NotifyTimes < this.cMap.car_notificationIds.length){
        this.startWaitingForResponse();
        this.timeTonotify = setTimeout(()=>{
          this.ClearInformation()
        }, this.timerBeforeNotify)
      }else{
        clearTimeout(this.timeTonotify)
        this.pop.clearAll(this.uid, true);
        console.log(this.NotifyTimes)
      
      }
  }


  ClearInformation(){
    let customer = firebase.database().ref(`Customer/${this.uid}`);
    customer.remove().then((success) =>{
      this.returningUser = false;
      var image = this.ph.user.photoURL;
      var name = this.ph.user.displayName;
      var pay = this.ph.paymentType;
      this.pop.calculateBtn = false;
  
      if (image == null){
       image = 'https://cdn1.iconfinder.com/data/icons/instagram-ui-glyph/48/Sed-10-128.png'
      }
        
      if (name == null){
        name = this.ph.user.email
      }
  
      if (pay == null){
        pay = 1
      }
  
      this.createUserInformation(name, image, this.cMap.lat, this.cMap.lng, this.myGcode.locationName, pay);
    })
  }




  startWaitingForResponse(){
    var connectedRef = firebase.database().ref(".info/connected");
    let CustomerRef = firebase.database().ref(`Customer/${this.uid}/`);
    let connect_change = true
    let picked_up = true
    let dropped = true
    let rated = true
    clearTimeout(this.cMap.timer1)
    CustomerRef.on('child_added', customerSnapshot => {
 
        if (this.returningUser){
            if (customerSnapshot.val().Driver_location){
              this.presentRouteLoader('Waiting...');
              //this.vibration.vibrate(1000);
              this.DriverFound(customerSnapshot.val().Driver_location,
              customerSnapshot.val().Driver_plate, 
              customerSnapshot.val().Driver_carType,
              customerSnapshot.val().Driver_name, 
              customerSnapshot.val().Driver_seat,
              customerSnapshot.val().Driver_locationName, 
              customerSnapshot.val().Driver_rating, 
              customerSnapshot.val().Driver_picture, 
              customerSnapshot.val().Driver_number,
              customerSnapshot.val().Client_locationName,
              customerSnapshot.val().Client_location[0],
              customerSnapshot.val().Client_location[1]);

            this.cMap.onDestinatiobarHide = true;
            
            }

          let driverPos = new google.maps.LatLng(customerSnapshot.val().Driver_location[0], customerSnapshot.val().Driver_location[1])
          let userPos = new google.maps.LatLng(customerSnapshot.val().Client_location[0], customerSnapshot.val().Client_location[1])
          this.dProvider.calcRoute(userPos, driverPos, true, false, 'ghjtfd')
      }
    });


    CustomerRef.on('child_changed', customerSnapshot => {
      
    if (customerSnapshot.val().Client_PickedUp && picked_up){
      this.presentRouteLoader('Waiting...');
      clearInterval(this.cMap.detectCarChange);
      this.cMap.toggleBtn = false;
      document.getElementById("header").innerText = "Your Journey Has Started.";
      this.toggleMore = true;
      if ( customerSnapshot.val().Client_price == null){
        this.presentRouteLoader('Waiting...');
        this.cMap.toggleBtn = false;
        this.toggleMore = true;
        picked_up = false;
        this.pop.showAlert("Please Add Your Destination", 'We Need This To Process Your Charge');
      }
    }
  
    if (customerSnapshot.val().Client_Dropped && dropped){
      this.presentRouteLoader('Waiting...')
      document.getElementById("header").innerText = "Your Journey Has Ended.";
      if (!customerSnapshot.val().Client_CanChargeCard){
       this.pop.dropoff(this.uid);
       this.ph.uid = this.uid
       dropped = false;
      }
    }

    if (customerSnapshot.val().Client_CanChargeCard){
      this.presentRouteLoader('Waiting...');
      
      if (!customerSnapshot.val().Client_HasRated && rated){
      if (this.ph.card != null){
        console.log(this.ph.card, this.ph.month, this.ph.cvc, this.ph.year, customerSnapshot.val().Client_price, this.ph.email)
       this.price = customerSnapshot.val().Client_price
       this.showPayAlert(this.price)
       } else{
        this.showPayCash('Pay NGN ' + customerSnapshot.val().Client_price + ' To This Driver.')
       }
       rated = false
      }
    }

    if (connect_change){
      this.presentRouteLoader('Waiting...')
      
      //this.vibration.vibrate(1000);
      connect_change = false
      this.pop.uid = this.uid
      this.DriverFound(customerSnapshot.val().Driver_location,
      customerSnapshot.val().Driver_plate, 
      customerSnapshot.val().Driver_carType,
      customerSnapshot.val().Driver_name, 
      customerSnapshot.val().Driver_seat,
      customerSnapshot.val().Driver_locationName, 
      customerSnapshot.val().Driver_rating, 
      customerSnapshot.val().Driver_picture, 
      customerSnapshot.val().Driver_number,
      customerSnapshot.val().Client_locationName,
      customerSnapshot.val().Client_location[0],
      customerSnapshot.val().Client_location[1]
     )

     this.storage.set(`currentUserId`, this.uid)
     this.cMap.onDestinatiobarHide = true;

    }

    this.userDestName = customerSnapshot.val().Client_destinationName;
    this.dProvider.name =  customerSnapshot.val().Driver_name;
    this.number = customerSnapshot.val().Driver_number
    this.pop.uid = this.uid
    if (customerSnapshot.val().Client_HasRated){
      this.presentRouteLoader('Waiting...')
      
       this.pop.clearAll(this.uid, true);
    
    }
     

     this.cMap.D_lat = customerSnapshot.val().Driver_location[0]
     this.cMap.D_lng = customerSnapshot.val().Driver_location[1]
     let userPos = new google.maps.LatLng(customerSnapshot.val().Client_location[0], customerSnapshot.val().Client_location[1])
     let driverPos = new google.maps.LatLng(customerSnapshot.val().Driver_location[0], customerSnapshot.val().Driver_location[1])
     console.log(this.myGcode.locationName, customerSnapshot.val().Driver_locationName)
     this.driverLocationName = customerSnapshot.val().Driver_locationName
     this.dProvider.calcRoute(userPos, driverPos, true, false, 'wertyrw')
    
    });

    CustomerRef.on('child_removed', customerSnapshot => {
      clearInterval(this.cMap.detectCarChange);
      CustomerRef.off('child_added');
      CustomerRef.off('child_changed');
      CustomerRef.off('child_removed');
      connectedRef.off('value');
      this.startedNavigation = false;
      this.storage.remove(`currentUserId`);
      connect_change = true;
     });


    
     connectedRef.on("value", (snap) => {
       if (snap.val() === true) {
         this.eventProvider.UpdateNetworkSate(true, this.uid);
       } else {
       // this.pop.showPimp("Connection Lost!. Please connect to the Internet.");
        this.eventProvider.UpdateNetworkSate(false, this.uid);
       }
     });

  }



  showPayCash(title ){
    let alert = this.alert.create({
      title: title,
      subTitle: "Please Setup Your Card Payment",
      buttons: [ {
        text: "Okay",
        role: 'cancel',
        handler: () => {
          //this.navCtrl.push(RatePage, { 'eventId': this.uid });
        }
      },],
      enableBackdropDismiss: false 
    });
    alert.present();
  }



   hideFunctionsOnDriverFound(){
    this.cMap.onbar2 = false
    this.cMap.onbar3 = true
  
    this.cMap.toggleBtn = true;
    this.cMap.onPointerHide = true;
   
    this.cMap.car_notificationIds = [];
    clearTimeout(this.timeTonotify)
    this.NotifyTimes = -1
   }  



   DriverFound(location, plate, carType, name, seat, locationName, rating, picture, number, userPos, client_lat, client_lng): Promise <any>{
    this.location = location; this.plate = plate; this.carType = carType; this.name = name; this.seat = seat; this.rating = rating; this.picture = picture;
  
    this.hideFunctionsOnDriverFound();
    
    this.cMap.lat = client_lat; 
    this.cMap.lng = client_lng;
   
       
    //this.calcRoute(userPos, locationName)
    

    this.cMap.D_lat = location[0]
    this.cMap.D_lng = location[1]
   
   // this.cMap.moveDriver(this.cMap.D_lat, this.cMap.D_lng);
   
    this.cMap.setMarkers(location, this.uid)
    return
    }
  

   ChargeCard(card, month, cvc, year, amount, email){
    let loading = this.loadingCtrl.create({
      content: 'Processing Charge...'
    });
  
    loading.present();
        this.platform.ready().then(() => {
          if (this.platform.is('cordova')) {
          // Now safe to use device APIs
          (<any>window).window.PaystackPlugin.chargeCard(
            (resp) =>{
              loading.dismiss();
              //this.pop.showPayMentAlert("Payment Was Successful", "We will Now Refund Your Balance");
              console.log('charge successful: ', resp);
              //this.navCtrl.push(RatePage, { 'eventId': this.uid });
            },
            (resp) =>{
              loading.dismiss();
              this.showPayMentErrorAlert('We Encountered An Error While Charging Your Card Pay Cash Of NGN ' + this.price )
            },
            {
              cardNumber: card, 
              expiryMonth: month, 
              expiryYear: year, 
              cvc: cvc,
              email: email,
              amountInKobo: amount,
          });
        }else{
         
        }
      })
  
  
  }

  
 
  showPayAlert(price){
    let alert = this.alert.create({
      title: 'Charge For This Trip is ' + price,
      subTitle: 'From ' + this.myGcode.locationName + ' To ' + this.userDestName + ' at 72NGN per KM.',
      buttons: [ 
        {
          text: "Checkout",
          handler: () => {
   
          this.ChargeCard(this.ph.card, this.ph.month, this.ph.cvc, this.ph.year, price*100,  this.ph.email)
            
          }
      },],
      enableBackdropDismiss: false 
    });
    alert.present();
  }



 showPayMentErrorAlert(title){
  let alert = this.alert.create({
    title: title,
    subTitle: "",
    buttons: [ 
      {
        text: "Okay",
        handler: () => {
 
          //this.navCtrl.push(RatePage, { 'eventId': this.uid });
 
        }
    },],
    enableBackdropDismiss: false 
  });
  alert.present();
}


  

presentRouteLoader(message) {
  let loading = this.loadingCtrl.create({
    content: message
  });

  loading.present();

  let myInterval = setInterval(() => {
    loading.dismiss();
 
    clearInterval(myInterval)
    
  }, 500);
}


}
