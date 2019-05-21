import User from '../models/user_model.js';
import jwt from 'jsonwebtoken'; // used to create, sign, and verify tokens
import bcrypt from 'bcryptjs';
import validater from '../helper';
import dotenv from 'dotenv';
const users = [];
dotenv.config();

class UserController {
    // Register user
    static registerUser(req, res) {
        const result = validater.registerUserValidation(req.body);
        if(result.error){
           return res.status(400).send({"status":400, "error":result.error.details[0].message});
        }

        //check if user already exists
        const verifyUser = users.find(c => c.email === req.body.email);
        if(verifyUser) return res.status(400).send({'error':'The user with the given email already exists.', 'status':404});
        
        const id = users.length + 1;
        const hashedPassword = bcrypt.hashSync(req.body.password, 8);
        
        // create a token
        const token = jwt.sign({ id: id }, process.env.SECRET_KEY, {
            expiresIn: 86400 // expires in 24 hours
        });
        const user = new User(id, req.body.email, req.body.firstName, req.body.lastName, hashedPassword, req.body.address, req.body.isAdmin); 
        users.push(user);
        return res.status(201).json({
                status: 201,
                data:{
                    token:token,
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    address: user.address,
                    status: user.status,
                    isAdmin: user.isAdmin
                }
          });
    }

     // Login User
     static LoginUser(req, res) {
        const result = validater.loginUserValidation(req.body);
        if(result.error){
           return res.status(400).send({"status":400, "error":result.error.details[0].message});
        }
        
        const user = users.find(c => c.email === req.body.email);
        if(!user) return res.status(404).send({'error':'The user with the given email was not found.', 'status':404});
        
        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({ 'error': 'Wrong password', 'status':401 });
        // create a token
        const token = jwt.sign({ id: user.id}, process.env.SECRET_KEY, {
            expiresIn: 86400 // expires in 24 hours
        });
        return res.status(200).json({
            status: 200,
            data:{
                token:token,
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address,
                status: user.status,
                isAdmin: user.isAdmin
            }
      });
        
    }
        
    // Mark User as Verified
    static VerifyUser(req, res) {  
        const token = req.headers['x-access-token'];
        if (!token) return res.status(401).send({ 'error': 'No token provided', 'status': 401 });
        
        jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
        if (err) return res.status(500).send({ status: 500, error: 'Failed to authenticate token.' });
        
        const user = users.find(c => c.id === decoded.id);
        if(user.isAdmin !=true) return res.status(401).send({status:401, error: 'You dont have administrative privileges to execute this route.'});
        
        //verify users email
        const result = validater.verifyUserValidation(req.params);
        if(result.error){
           return res.status(400).send({"status":400, "error":result.error.details[0].message});
        }
        //Get user to be verified
        const userToBeVerified = users.find(c => c.email === req.params.userEmail);
        if(!userToBeVerified) return res.status(404).send({'error':'The user with the given email was not found.', 'status':404});
        userToBeVerified.status = 'verified';
        
        // Return the verified user
        return res.status(200).json({
            status: 200,
            data:userToBeVerified
        });
    });
}
 
}

export default {UserController, users};