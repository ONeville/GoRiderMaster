
export class UserLoginModel {
    public Id: string = '';
    public Email: string;
    public IsPassenger: boolean

    constructor(){
 
    }
    setUser(id, email, isPassenger){
        this.Id = id;
        this.Email = email;
        this.IsPassenger = isPassenger;
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
            isPassenger: this.IsPassenger
        }
    }
}