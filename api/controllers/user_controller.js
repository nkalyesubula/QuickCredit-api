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

     
 
}
module.exports.UserController = UserController;
module.exports.users = users;