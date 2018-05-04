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