export class PassengerProfileModel {
 
    constructor(public userId: string
        , public FirstName: string
        , public LastName: string
        , public Phone: number) {
 
    }
 
    getProfile(){
        return {
            profileId: 0,
            userId: this.userId,
            FirstName: this.FirstName,
            LastName: this.LastName,
            Phone: this.Phone
        }
    }
}

export class DriverProfileModel {
 
    constructor(public userId: string
        , public FirstName: string
        , public LastName: string
        , public License: string
        , public Phone: number) {
 
    }
 
    getProfile(){
        return {
            profileId: 0,
            userId: this.userId,
            FirstName: this.FirstName,
            LastName: this.LastName,
            Phone: this.Phone
        }
    }
}

export class RequestModel {
 
    constructor(public PickupLocation: string, public Destinantion: string) {
 
    }
 
    getRequest(){
        return {
            profileId: 0,
            pickupLocation: this.PickupLocation,
            destinantion: this.Destinantion
        }
    }
}