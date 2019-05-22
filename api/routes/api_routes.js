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
routes.get('/api/v1/loans/:id', LoanController.getSpecificLoan);
routes.get('/api/v1/loans', LoanController.getAllLoans);
routes.get('/api/v1/loans?status=approved&&repaid=true', LoanController.getAllLoans);
routes.get('/api/v1/loans?status=approved&&repaid=false',LoanController.getAllLoans);
routes.put('/api/v1/loans/:id', LoanController.updateLoanStatus);
export default routes;