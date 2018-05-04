export class PassengerProfileModel {
    public ProfileId: string = '0'    
    public userId: string
    public FirstName: string
    public LastName: string
    public Phone: number
    constructor() {
 
    }

    setProfile(firstName, lastName, phone, profileId = '0', userId = '0'){
        this.ProfileId = profileId;
        this.userId = userId;
        this.FirstName = firstName;
        this.LastName = lastName;
        this.Phone = phone;
    }
 
    getProfile(){
        return {
            profileId: this.ProfileId,
            userId: this.userId,
            firstName: this.FirstName,
            lastName: this.LastName,
            phone: this.Phone
        }
    }
}