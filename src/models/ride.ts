
export class RideModel {
    public Id: string = '0'    
    public DriverId: string
    public ClientId: string
    public StartTime: Date
    public EndTime: Date
    public StartingPoint: string
    public EndingPoint: string
    public StartingGPS: number
    public EndingGPS: number
    public IsComplete: number
    public GrossPrice: number

    setModel(id, driver, client,startTime,
        endTime,
        startingPoint,
        endingPoint,
        startingGPS,
        endingGPS,
        isComplete,
        grossPrice){
        this.Id = id;
        this.DriverId = driver;
        this.ClientId = client;
        this.StartTime = startTime;
        this.EndTime = endTime;
        this.StartingPoint = startingPoint;
        this.EndingPoint = endingPoint;
        this.StartingGPS = startingGPS;
        this.EndingGPS = endingGPS;
        this.IsComplete = isComplete;
        this.GrossPrice = grossPrice;
    }
 
    getModel(){
        return {
            id: this.Id,   
            driverId: this.DriverId,
            clientId: this.ClientId,
            startTime: this.StartTime,
            endTime: this.EndTime,
            startingPoint: this.StartingPoint,
            endingPoint: this.EndingPoint,
            startingGPS: this.StartingGPS,
            endingGPS: this.EndingGPS,
            isComplete: this.IsComplete,
            grossPrice: this.GrossPrice
        }
    }
}

import firebase from 'firebase';
export class RideService { 
    addRide(ride: RideModel) {
        return firebase.database().ref(`RideModel`).set(ride.getModel());
    }

    updateRide(ride: RideModel) {
        return firebase.database().ref(`RideModel/${ride.Id}`).update({
            endTime: ride.EndTime,
            endingPoint: ride.EndingPoint,
            endingGPS: ride.EndingGPS,
            isComplete: ride.IsComplete,
            grossPrice: ride.GrossPrice
        });
    }
    getClientRides(id) {
        return firebase.database().ref(`RideModel/${id}`).update({ });
    }
    getDriverRides(id) {
        return firebase.database().ref(`RideModel/${id}`).update({  });
    }
}