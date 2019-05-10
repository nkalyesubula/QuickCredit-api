var users_list = require('./user_controller.js');
var Loan = require('../models/loan_model.js');
var Repayment = require('../models/repayment_model');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config'); 

const users = users_list.users;
const loans = [];
const repayments = [];

class LoanController {
    // Request Loan
    static requestLoan(req, res) {
        var token = req.headers['x-access-token'];
        if (!token) return res.status(401).send({ 'error': 'No token provided', 'status': 400 });
        
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) return res.status(500).send({ status: 500, error: 'Failed to authenticate token.' });

            const user = users.find(c => c.id === decoded.id);
            if(user.status == 'unverified')  return res.status(400).send({'error':'User is not verified'});
            if(!req.body.tenor || !req.body.amount){
                // 400 Bad Request
                return res.status(400).send({'error':'Enter all the required fields'});
            }

            if(req.body.tenor< 1 || req.body.tenor > 12){
               return res.status(400).send({'error':'Tenor should be atleast 1 month but should not exceed the maximum of 12 months'});
            }
            const datatime = new Date();
            const loan = new Loan(loans.length + 1, datatime, user.email, req.body.tenor, req.body.amount);
            loans.push(loan);
            return res.status(201).json({
                status: 201,
                data:{
                    loanId : loan.id,
                    firstName : user.firstName,
                    lastName : user.lastName,
                    email : user.email,
                    tenor : loan.tenor,
                    amount : loan.amount,
                    paymentInstallment: loan.paymentInstallment,
                    status : loan.status,
                    balance : loan.balance,
                    interest : loan.interest,
                    createdOn: loan.createdOn
                }
          });

    });
}

    //Get a specific loan
    static getSpecificLoan(req, res) {
        var token = req.headers['x-access-token'];
        if (!token) return res.status(401).send({ 'error': 'No token provided', 'status': 400 });
        
        jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(500).send({ status: 500, error: 'Failed to authenticate token.' });
        
        const user = users.find(c => c.id === decoded.id);
        if(user.isAdmin !=true) return res.status(401).send({status:401, error: 'You dont have administrative privileges to execute this route.'});
        const loan = loans.find(c => c.id === parseInt(req.params.id));
        if(!loan) res.status(404).send({'error':'The loan with the given ID was not found.'});
        return res.status(200).json({
            status: 200,
            data:loans
        });
        });
    }

    //Get all loans
    static getAllLoans(req, res) {
        var token = req.headers['x-access-token'];
            if (!token) return res.status(401).send({ 'error': 'No token provided', 'status': 400 });
            
            jwt.verify(token, config.secret, function(err, decoded) {
            if (err) return res.status(500).send({ status: 500, error: 'Failed to authenticate token.' });
            
            const user = users.find(c => c.id === decoded.id);
            if(user.isAdmin !=true) return res.status(401).send({status:401, error: 'You dont have administrative privileges to execute this route.'});
            return res.status(200).json({
                status: 200,
                data:loans
        });
        });
        }

    //Approve or reject a loan application.
    static updateLoanStatus(req, res) {
        var token = req.headers['x-access-token'];
        if (!token) return res.status(401).send({ 'error': 'No token provided', 'status': 400 });
        
        jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(500).send({ status: 500, error: 'Failed to authenticate token.' });
        
        const user = users.find(c => c.id === decoded.id);
        if(user.isAdmin !=true) return res.status(401).send({status:401, error: 'You dont have administrative privileges to execute this route.'});
        const loan = loans.find(c => c.id === parseInt(req.params.id));
        if(!loan) res.status(404).send({'error':'The loan with the given ID was not found.'});
        if(!req.body.status) res.status(400).send({'error':'No status provided'});
        if(req.body.status != 'approved' && req.body.status != 'rejected') res.status(400).send({'error':'the status should either be approved or rejected'});

        //Update loan status
        loan.status = req.body.status;

        return res.status(200).json({
            status: 200,
            data:loans
        });
        });
    }

    // Create a loan repayment record.
    static payLoan(req, res) {
        var token = req.headers['x-access-token'];
        if (!token) return res.status(401).send({ 'error': 'No token provided', 'status': 400 });
        
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) return res.status(500).send({ status: 500, error: 'Failed to authenticate token.' });

            const user = users.find(c => c.id === decoded.id);
            const loan = loans.find(c => c.id === parseInt(req.params.id));
            if(user.email != loan.user || user.status !='verified' || loan.status !='approved') return res.status(400).send({'error':'User is not verified or Loan is not approved or is rejected or no loan with the provided id is found'});
            if(!req.body.amount) return res.status(400).send({'error':'No amount provided'});

            const datatime = new Date();
            const repayment = new Repayment(repayments.length + 1, datatime ,req.params.id,req.body.amount);
            repayments.push(repayment);
            loan.balance = loan.balance - req.body.amount;
            if(loan.balance <= 0) loan.repaid = true;

            return res.status(201).json({
                status: 201,
                data:{
                    id:repayment.id,
                    loanId : loan.id,
                    createdOn : repayment.createdOn,
                    amount : loan.amount,
                    monthlyPayment: loan.paymentInstallment,
                    paidAmount: Repayment.amount,
                    balance : loan.balance
                }
          });

                
           
    });

    }


    //Get all repaid or current loans
    static CurrentOrRepaidLoans(req, res) {
        var token = req.headers['x-access-token'];
            if (!token) return res.status(401).send({ 'error': 'No token provided', 'status': 400 });
            
            jwt.verify(token, config.secret, function(err, decoded) {
            if (err) return res.status(500).send({ status: 500, error: 'Failed to authenticate token.' });
            
            const user = users.find(c => c.id === decoded.id);
            
            const status =  req.query.status;
            const repaid =  req.query.repaid;
            loans_list = [];
            for(let i=0; i < loans.length; i++){
                if(loans[i].status == status && loans[i].repaid == repaid){
                    loans_list.push(loans[i]);
                }
            }
            if(loans_list.length == 0) return res.status(404).send({status:404, error: 'No results found'});
            if(user.isAdmin !=true) return res.status(401).send({status:401, error: 'You dont have administrative privileges to execute this route.'});
            return res.status(200).json({
                status: 200,
                data:loans_list
        });
        });
        }


}



module.exports = LoanController;