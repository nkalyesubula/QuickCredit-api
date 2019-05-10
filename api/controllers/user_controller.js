var User = require('../models/user_model.js');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var config = require('../config'); // get config file
const users = [];

class UserController {
    // Register user
    static registerUser(req, res) {
        if(!req.body.email || !req.body.firstName || !req.body.lastName || !req.body.password || !req.body.address){
            // 400 Bad Request
            res.status(400).send({'error':'Enter all the required fields'});
        }
        let isAdmin = req.body.isAdmin;
        if(isAdmin !=true){
            isAdmin = false;
        } 
        const id = users.length + 1;

        var hashedPassword = bcrypt.hashSync(req.body.password, 8);
        
        // create a token
        var token = jwt.sign({ id: id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        const user = new User(id, req.body.email, req.body.firstName, req.body.lastName, hashedPassword, req.body.address, isAdmin); 
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
                    isAdmin: isAdmin
                }
          });
    }

     // Login User
     static LoginUser(req, res) {
        if(!req.body.email || !req.body.password){
            // 400 Bad Request
            res.status(400).send({'error':'Enter all the required fields','status':400});
        }
        
        const user = users.find(c => c.email === req.body.email);
        if(!user) res.status(404).send({'error':'The user with the given email was not found.', 'status':404});
        
        
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({ 'error': 'Wrong password', 'status':401 });
        // create a token
        var token = jwt.sign({ id: user.id}, config.secret, {
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
        var token = req.headers['x-access-token'];
        if (!token) return res.status(401).send({ 'error': 'No token provided', 'status': 400 });
        
        jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(500).send({ status: 500, error: 'Failed to authenticate token.' });
        
        const user = users.find(c => c.id === decoded.id);
        if(user.isAdmin !=true) return res.status(401).send({status:401, error: 'You dont have administrative privileges to execute this route.'});
        //verify users email
        if(!req.params.user_email){
            // 400 Bad Request
            res.status(400).send({status:400, error:'Email is required'});
        }

        if(user.email != req.params.user_email) res.status(400).send({'error':'Wrong email provided'});
        //Update user status
        user.status = 'verified';
        
        // Return the verified user
        return res.status(200).json({
            status: 200,
            data:user
        });
    });
}
 
}
module.exports.UserController = UserController;
module.exports.users = users;