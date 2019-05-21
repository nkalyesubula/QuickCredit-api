const Joi = require('joi');

class apiValidations{
    //
    tokenValidation(){
        const token = req.headers['x-access-token'];
        if (!token) return res.status(401).send({ 'error': 'No token provided', 'status': 401 });
        
        jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
        if (err) return res.status(401).send({ status: 401, error: 'Failed to authenticate token.' });
        });
    }

    //register user validations 
    registerUserValidation(postedData){
        const schema = {
            firstName: Joi.string().min(3).max(15).required(),
            lastName: Joi.string().min(3).max(25).required(),
            address: Joi.string().min(5).max(25).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(3).max(15).required(),
            isAdmin:Joi.bool().valid(true, false).required(),
          };
        return Joi.validate(postedData,schema);
    }
    
    //login user validations 
    loginUserValidation(postedData){
        const schema = {
            email: Joi.string().email().required(),
            password: Joi.string().min(3).max(15).required(),
          };
        return Joi.validate(postedData,schema);
    }

    //verify user validations userEmail
    verifyUserValidation(postedData){
        const schema = {
            userEmail: Joi.string().email().required(),
          };
        return Joi.validate(postedData,schema);
    }
    
    //apply for a loan
    requestLoanValidation(postedData){
        const schema = {
            tenor: Joi.number().integer().positive().max(12).required(),
            amount:Joi.number().positive().required(),
        };
        return Joi.validate(postedData,schema);
    }

    //get current loans or repaid loans
    LoansValidation(postedData){
        const schema = {
            status: Joi.string().valid('approved').required(),
            repaid:Joi.bool().valid('true', 'false').required(),
        };
        return Joi.validate(postedData,schema);
    }


}
const validate = new apiValidations();
module.exports = validate;