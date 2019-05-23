import Router from 'express';
import users from '../controllers/user_controller.js';
const routes = Router();

// users routes
routes.post('/api/v1/auth/signup', users.UserController.registerUser);
routes.post('/api/v1/auth/signin', users.UserController.LoginUser);

export default routes;