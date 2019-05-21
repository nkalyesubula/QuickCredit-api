import Router from 'express';
import users from '../controllers/user_controller.js';
import LoanController from '../controllers/loan_controller.js';
const routes = Router();

// users routes
routes.post('/api/v1/auth/signup', users.UserController.registerUser);

export default routes;