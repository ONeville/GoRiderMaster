
export class UserLoginModel {
    public Id: string = '';
    public Email: string;
    public IsPassenger: boolean = false
    public DisplayName: string = '';

    constructor(){
 
    }
    setUser(id, email, isPassenger, name){
        this.Id = id;
        this.Email = email;
        this.IsPassenger = isPassenger;
        this.DisplayName = name;
    }
    setPassengerUser(email){
        this.Email = email;
        this.IsPassenger = true;
    }

    setDriverUser(email){
        this.Email = email;
        this.IsPassenger = false;
    }

    getUser(){
        return {
            email: this.Email,
            isPassenger: this.IsPassenger,
            displayName: this.DisplayName
        }
    }

}