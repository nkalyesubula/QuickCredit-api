var Joi = require('joi');

class apiValidations{
    
    //register user validations 
    registerUserValidation(postedData){
        const schema = {
            firstName: Joi.string().min(3).max(15).required(),
            lastName: Joi.string().min(3).max(25).required(),
            address: Joi.string().min(5).max(25).required(),
            email: Joi.string().email().required(),
            password: Joi.string().regex(/^[a-zA-Z0-9]{5,30}$/).required(),
            isAdmin:Joi.bool().valid(true, false).required(),
          };
        return Joi.validate(postedData,schema);
    }
    
    //login user validations 
    loginUserValidation(postedData){
        const schema = {
            email: Joi.string().email().required(),
            password: Joi.string().regex(/^[a-zA-Z0-9]{5,30}$/).required(),
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
    
    requestLoanValidation(postedData){
        const schema = {
            tenor: Joi.number().integer().positive().max(12).required(),
            amount:Joi.number().positive().required(),
        };
        return Joi.validate(postedData,schema);
    }
}
const validate = new apiValidations();
module.exports = validate;