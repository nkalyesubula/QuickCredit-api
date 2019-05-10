var Router = require('express');
var users = require('../controllers/user_controller.js');
var LoanController = require('../controllers/loan_controller.js');
const routes = Router();

// users routes
routes.post('/api/v1/auth/signup', users.UserController.registerUser);
routes.post('/api/v1/auth/signin', users.UserController.LoginUser);
routes.put('/api/v1/users/:user_email/verify', users.UserController.VerifyUser);

// Loan routes
routes.post('/api/v1/loans', LoanController.requestLoan);




module.exports = routes;