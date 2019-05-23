import User from '../models/user_model';
import jwt from 'jsonwebtoken'; // used to create, sign, and verify tokens
import bcrypt from 'bcryptjs';
import validater from '../helper';
import pool from '../../services/connectdb';
import dotenv from 'dotenv';

dotenv.config();

class UserController {
////////////////////////////////////////////////////// Register user ////////////////////////////////////////////////////////////////////////////////////
      static registerUser(req, res) {
        const result = validater.registerUserValidation(req.body);
        if(result.error) return res.status(400).send({"status":400, "error":result.error.details[0].message});
        
        // check if user already exists
        const query = 'SELECT * FROM users WHERE email =$1';
        const value=[req.body.email];
        pool.query(query, value, (error, result) => {
          if(result.rows.length > 0) {
            return res.status(400).send({ "status":400, "error":"User already exists"});
          } else {
            
            const hashedPassword = bcrypt.hashSync(req.body.password, 8);
        
            const user = new User(req.body.email, req.body.firstName, req.body.lastName, hashedPassword, req.body.address, req.body.isAdmin);
        
            const query = 'INSERT INTO users(firstName,lastName, address, email, password, isAdmin) VALUES($1,$2,$3,$4,$5,$6) RETURNING *';
            const values = [user.firstName, user.lastName, user.address,user.email, user.password, user.isAdmin];
    
            pool.query(query, values, (error, result) => {
                if (error) {
                    return res.status(400).json({status:400, error:error});
                }else{
                // create a token
                const token = jwt.sign({ id: result.rows[0]['id'] }, process.env.SECRET_KEY , {
                    expiresIn: 86400 // expires in 24 hours
                });
                return res.status(201).json({
                    status: 201,
                    data:{
                        token:token,
                        id: result.rows[0]['id'],
                        email: result.rows[0]['email'],
                        firstName: result.rows[0]['firstname'],
                        lastName: result.rows[0]['lastname'],
                        address: result.rows[0]['address'],
                        status: result.rows[0]['status'],
                        isAdmin: result.rows[0]['isadmin']
                    }
                });}
            });
        }
        });
}

 // Login User
 static LoginUser(req, res) {
    const result = validater.loginUserValidation(req.body);
    if(result.error){
       return res.status(400).send({"status":400, "error":result.error.details[0].message});
    }
    
    //check if the email already exists
    // check if user already exists
    const query = 'SELECT * FROM users WHERE email =$1';
    const value=[req.body.email];
    pool.query(query, value, (error, result) => {
        if(result.rows.length > 0){
        const passwordIsValid = bcrypt.compareSync(req.body.password, result.rows[0]['password']);
        if(!passwordIsValid) return res.status(401).send({ 'error': 'Wrong password', 'status':401 });
            // create a token
            const token = jwt.sign({ id: result.rows[0]['id'] }, process.env.SECRET_KEY , {
            expiresIn: 86400 // expires in 24 hours
        });
        return res.status(201).json({
            status: 201,
            data:{
                token:token,
                id: result.rows[0]['id'],
                email: result.rows[0]['email'],
                firstName: result.rows[0]['firstname'],
                lastName: result.rows[0]['lastname'],
                address: result.rows[0]['address'],
                status: result.rows[0]['status'],
                isAdmin: result.rows[0]['isadmin']
            }
        });
      }
      return res.status(404).send({'error':'The user with the given email was not found.', 'status':404});
    });   
}


}
export default {UserController};