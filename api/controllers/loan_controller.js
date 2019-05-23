import Loan from '../models/loan_model.js';
import jwt from 'jsonwebtoken'; // used to create, sign, and verify tokens
import bcrypt from 'bcryptjs';
import validater from '../helper';
import pool from '../../services/connectdb';
import dotenv from 'dotenv';

dotenv.config();

class LoanController {
   ///////////////////////////////////////////////////// Request Loan ////////////////////////////////////////////////////////////////////
   static requestLoan(req, res) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ 'error': 'No token provided', 'status': 400 });
    
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded)=> {
        if (err) return res.status(401).send({ status: 401, error: 'Failed to authenticate token.' });

        //check if user is verified
        const query = 'SELECT * FROM users WHERE id =$1';
        const value=[decoded.id];
        pool.query(query, value, (error, result) => {
            if(result.rows[0]['status'] == 'unverified')  return res.status(400).send({'error':'User is not verified'});
            //validate  provided loan details 
            const results = validater.requestLoanValidation(req.body);
            if(results.error) return res.status(400).send({"status":400, "error":results.error.details[0].message});
            const firstName = result.rows[0]['firstname'];
            const lastName = result.rows[0]['lastname'];
            const email = result.rows[0]['email'];
            const loan = new Loan(email, req.body.tenor, req.body.amount);
            const appyLoanQuery = 'INSERT INTO loans(useremail, tenor, amount, interest, paymentinstallment, balance) VALUES($1,$2,$3,$4,$5,$6) RETURNING *';
            const loanValues = [loan.user, loan.tenor, loan.amount, loan.interest, loan.paymentInstallment, loan.balance];
            pool.query(appyLoanQuery, loanValues, (error, result) => {
                return res.status(201).json({
                    status: 201,
                    data:{
                        loanId : result.rows[0]['id'],
                        firstName : firstName,
                        lastName : lastName,
                        email : result.rows[0]['useremail'],
                        tenor : result.rows[0]['tenor'],
                        amount : result.rows[0]['amount'],
                        paymentInstallment: result.rows[0]['paymentinstallment'],
                        status : result.rows[0]['status'],
                        balance : result.rows[0]['balance'],
                        interest : result.rows[0]['interest'],
                        createdOn: result.rows[0]['createdon']
                    }
              });
            });
        });
});
}

//////////////////////////////////////////Approve or reject a loan application.//////////////////////////////////////////////////////////////////////////////////
static updateLoanStatus(req, res) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ 'error': 'No token provided', 'status': 400 });
    
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded)=> {
    const validateId = validater.loanIdValidation(req.params);
    if(validateId.error) return res.status(400).send({"status":400, "error":validateId.error.details[0].message});
    if(!req.body.status) return res.status(400).send({'error':'No status provided'});
    if(req.body.status != 'approved' && req.body.status != 'rejected') res.status(400).send({'error':'the status should either be approved or rejected'});
    
    //check if user is an admin
    const getUserQuery = 'SELECT * FROM users WHERE id =$1';
    const userId=[decoded.id];
    const getLoanQuery = 'SELECT * FROM loans WHERE id =$1';
    const loanId=[parseInt(req.params.id)];
    const updateLoanQuery = 'UPDATE loans set status=$1 WHERE id =$2';
    const loanArgs=[req.body.status, req.params.id];
    pool.query(getUserQuery, userId, (error, result) => {
        if(result.rows[0]['isadmin'] != true)  return res.status(401).send({status:401, error: 'You dont have administrative privileges to execute this route.'});
        pool.query(getLoanQuery, loanId, (error, result) => {
            if(result.rows.length == 0) return res.status(404).send({'error':'The loan with the given ID was not found.'});
            pool.query(updateLoanQuery, loanArgs, (error, result) => {
                pool.query(getLoanQuery, loanId, (error, result) => {
                    return res.status(200).json({
                        status: 200,
                        data:{
                            loanId : result.rows[0]['id'],
                            email : result.rows[0]['useremail'],
                            tenor : result.rows[0]['tenor'],
                            amount : result.rows[0]['amount'],
                            paymentInstallment: result.rows[0]['paymentinstallment'],
                            status : result.rows[0]['status'],
                            balance : result.rows[0]['balance'],
                            interest : result.rows[0]['interest'],
                            createdOn: result.rows[0]['createdon']
                        }
                    });
                });
            });

        });

});
});
}

 /////////////////////////////////////////////////////Get a specific loan/////////////////////////////////////////////////////////////////////////
 static getSpecificLoan(req, res) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ 'error': 'No token provided', 'status': 400 });
    
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded)=> {
    if (err) return res.status(401).send({ status: 401, error: 'Failed to authenticate token.' });
    const validateId = validater.loanIdValidation(req.params);
    if(validateId.error) return res.status(400).send({"status":400, "error":validateId.error.details[0].message});
    //check if user is an admin
    const getUserQuery = 'SELECT * FROM users WHERE id =$1';
    const userId=[decoded.id];
    const getLoanQuery = 'SELECT * FROM loans WHERE id =$1';
    const loanId=[parseInt(req.params.id)];
    pool.query(getUserQuery, userId, (error, result) => {
        if(result.rows[0]['isadmin'] != true)  return res.status(401).send({status:401, error: 'You dont have administrative privileges to execute this route.'});
        pool.query(getLoanQuery, loanId, (error, result) => {
            if(result.rows.length == 0) return res.status(404).send({'error':'The loan with the given ID was not found.'});
            return res.status(200).json({
                status: 200,
                data:{
                    loanId : result.rows[0]['id'],
                    email : result.rows[0]['useremail'],
                    tenor : result.rows[0]['tenor'],
                    amount : result.rows[0]['amount'],
                    paymentInstallment: result.rows[0]['paymentinstallment'],
                    status : result.rows[0]['status'],
                    balance : result.rows[0]['balance'],
                    repaid : result.rows[0]['repaid'],
                    interest : result.rows[0]['interest'],
                    createdOn: result.rows[0]['createdon']
                }
            });
        });
    });
    });
}

/////////////////////////////////////////////////////////Get all loans///////////////////////////////////////////////////////////////////////////////////////////////
static getAllLoans(req, res) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ 'error': 'No token provided', 'status': 400 });
    
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded)=> {
    if (err) return res.status(401).send({ status: 401, error: 'Failed to authenticate token.' });
    //check if user is an admin
    const getUserQuery = 'SELECT * FROM users WHERE id =$1';
    const getLoansQuery = 'SELECT * FROM loans';
    const userId=[decoded.id];
    pool.query(getUserQuery, userId, (error, result) => {
        if(result.rows[0]['isadmin'] != true)  return res.status(401).send({status:401, error: 'You dont have administrative privileges to execute this route.'});
            
       // Get all repaid or current loans
        if(Object.keys(req.query).length != 0 && req.query.constructor === Object){
            const result = validater.LoansValidation(req.query);
            if(result.error) return res.status(400).send({"status":400, "error":result.error.details[0].message}); 
            const status =  req.query.status;
            const repaid = req.query.repaid;
            const categories= [status, repaid];

            const getLoansCategories = 'SELECT * FROM loans WHERE status=$1 AND repaid=$2';
            pool.query(getLoansCategories, categories, (error, result) => {
                return res.status(200).json({
                    status: 200,
                    data:result.rows
                });
            });
        }
        else{
        
            //Get all loans
        pool.query(getLoansQuery, (error, result) => {
            return res.status(200).json({
                status: 200,
                data:result.rows
            });
        });
    }
    });    
   
});
    
}



}

export default LoanController;
