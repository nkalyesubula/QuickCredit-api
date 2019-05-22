import Router from 'express';
import users from '../controllers/user_controller.js';
import LoanController from '../controllers/loan_controller.js';
const routes = Router();

// users routes
routes.post('/api/v1/auth/signup', users.UserController.registerUser);
routes.post('/api/v1/auth/signin', users.UserController.LoginUser);
routes.put('/api/v1/users/:userEmail/verify', users.UserController.VerifyUser);

// Loan routes
routes.post('/api/v1/loans', LoanController.requestLoan);
export default routes;