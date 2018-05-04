
export class UserLoginModel {
    public UserId: string;
    public Email: string;
    public Password: string

    constructor(){
 
    }
 
    setId(id){
        this.UserId = id;
    }

    setUser(email, password){
        this.UserId = 'o';
        this.Email = email;
        this.Password = password;
    }

    getUser(){
        return {
            UserId: this.UserId,
            email: this.Email,
            password: this.Password
        }
    }
}