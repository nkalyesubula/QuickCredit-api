var Joi = require('joi');

class apiValidations{
    registerUserValidation(postedData){
        const schema = {
            firstname: Joi.string().min(3).max(15).required(),
            lastname: Joi.string().min(3).max(25).required(),
            address: Joi.string().min(5).max(25).required(),
            email: Joi.string().email().required(),
            password: Joi.string().regex(/^[a-zA-Z0-9]{5,30}$/).required(),
          };
          return Joi.validate(postedData,schema);
    }

    requestLoanValidation(postedData){
        const schema = {
            tenor: Joi.number().integer().positive().max(12).required(),
            amount:Joi.number().precision(2).required(),
        };
        return Joi.validate(postedData,schema);
    }
}
const validate = new apiValidations();
module.exports = validate;