import pool from '../../services/connectdb';
class User{
    constructor(email, firstName, lastName, hashedPassword, address, isAdmin){
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = hashedPassword;
        this.address = address;
        this.status = 'unverified';
        this.isAdmin = isAdmin;
    }
}
export default User;