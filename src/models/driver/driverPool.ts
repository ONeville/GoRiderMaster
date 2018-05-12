import { RiderState } from '../enums'
export class DriverPoolModel {
    // public Id: string = '0'    
    public DriverId: string
    public DriverStatus: number
    public Quote: number
    public Location: Array<number>
    public StatusTime: number
    constructor() {
 
    }

    setModel(driver, status, quote, location, statusTime){
        // this.Id = id;
        this.DriverId = driver;
        this.DriverStatus = status;
        this.Quote = quote;
        this.Location = location;
        this.StatusTime = statusTime;
    }
 
    getModel(){
        return {
            // id: this.Id,   
            driverId: this.DriverId,
            driverStatus: this.DriverStatus,
            price: this.Quote,
            location: this.Location,
            statusTime: this.StatusTime
        }
    }
}

import firebase from 'firebase';
export class DriverPoolService {
    constructor() {
 
    }

    addDriverInPool(pool: DriverPoolModel) {
        return firebase.database().ref(`driverPoolModel/${pool.DriverId}`).set(pool.getModel());
    }

    updateDriverStatus(pool: DriverPoolModel) {
        return firebase.database().ref(`driverPoolModel/${pool.DriverId}`).update({
            driverStatus: pool.DriverStatus,
            price: pool.Quote,
            location: pool.Location
        });
    }
    removeDriverFromPool(pool: DriverPoolModel) {
        return firebase.database().ref(`driverPoolModel/${pool.DriverId}`).remove();
    }
}
