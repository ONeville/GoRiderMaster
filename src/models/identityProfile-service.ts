import firebase from 'firebase';
import { PassengerProfileModel } from './client/passengerProfile';
import { DriverProfileModel } from './driver/driverProfile';

export class IdentityProfileService {

    constructor() {
 
    }

    updateClientProfile(profile: PassengerProfileModel) {
        return firebase.database().ref(`passengerModel/${profile.userId}`).update({
            firstName: profile.FirstName,
            lastName: profile.LastName,
            phone: profile.Phone
        });
    }

    updateDriverProfile(profile: DriverProfileModel) {
        return firebase.database().ref(`passengerModel/${profile.userId}`).update({
            firstName: profile.FirstName,
            lastName: profile.LastName,
            phone: profile.Phone
        });
    }

    updateFirstNameProfile(profile: PassengerProfileModel) {
        return firebase.database().ref(`userModel/${profile.userId}`).update({
            firstName: profile.FirstName
        });
    }
    updateLastNameProfile(profile: PassengerProfileModel) {
        return firebase.database().ref(`userModel/${profile.userId}`).update({
            lastName: profile.LastName
        });
    }
    updatePhoneProfile(profile: PassengerProfileModel) {
        return firebase.database().ref(`userModel/${profile.userId}`).update({
            phone: profile.Phone
        });
    }
}