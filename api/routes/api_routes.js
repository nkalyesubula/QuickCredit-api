var Router = require('express');
var users = require('../controllers/user_controller.js');
const routes = Router();

// users routes
routes.post('/api/v1/auth/signup', users.UserController.registerUser);


module.exports = routes;