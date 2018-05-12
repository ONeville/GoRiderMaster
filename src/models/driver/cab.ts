export class CabModel {
    public CabId: string = '0'    
    public DriverId: string
    public LicensePlate: string
    public Model: string
    public Mark: string
    public Year: number
    constructor() {
 
    }

    setModel(id, driver, license, model, mark, year){
        this.CabId = id;
        this.DriverId = driver;
        this.LicensePlate = license;
        this.Model = model;
        this.Mark = mark;
        this.Year = year;
    }
 
    getModel(){
        return {
            cabId: this.CabId,  
            driverId: this.DriverId,
            licensePlate: this.LicensePlate,
            model: this.Model,
            mark: this.Mark,
            year: this.Year
        }
    }
}

import firebase from 'firebase';
export class CabService {
    constructor() {
 
    }

    addCab(cab: CabModel) {
        return firebase.database().ref(`cabModel/${cab.DriverId}`).set(cab.getModel());
    }
    updateCab(cab: CabModel) {
        return firebase.database().ref(`cabModel/${cab.DriverId}`).update({
            licensePlate: cab.LicensePlate,
            model: cab.Model,
            mark: cab.Mark,
            year: cab.Year
        });
    }
    removeCab(profile: CabModel) {
        return firebase.database().ref(`cabModel/${profile.DriverId}`).remove();
    }
}