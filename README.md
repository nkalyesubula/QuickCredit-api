# QuickCredit

## Project overview:

Quick Credit is an online lending platform that provides short term soft loans to individuals. This helps solve problems of financial inclusion as a way to alleviate poverty and empower low income earners.

## Features (UI)
1. User can view all loan repayment history.
2. Admin can mark a client as verified after confirming the client’s work or home
  address.
3. Admin can view all loan applications.
4. Admin can view a specific loan application.
5. Admin can view current loans (not fully repaid).
6. Admin can view all repaid loans.
7. Admin can approve or reject a client’s loan application.
8. Admin can post loan repayment transaction in favour of a client.

## Features (API - Endpoints)
1. User sign up. [done] ```POST``` on ```localhost:8000/api/v1/auth/signup```
2. User sign in. [done] ```POST``` on ```localhost:8000/api/v1/auth/signin```
3. User can apply for a loan. [done] ```POST``` on ```localhost:8000/api/v1/loans```
4. Admin can mark a client as verified after confirming the client’s work or home
   address. [done] ```PUT``` on ```localhost:8000/api/v1/users/:user_email/verify```
5. Admin can view all loan applications. [done] ```GET``` on ```localhost:8000/api/v1/loans```
6. Admin can view a specific loan application. [done] ```GET``` on ```localhost:8000/api/v1/loans/:id```
7. Admin can view current loans (not fully repaid). [done] ```GET``` on ```localhost:5000//api/v1/loans?status=approved&&repaid=false```
8. Admin can view all repaid loans. [done] ```GET``` on ``` localhost:8000/api/v1/loans?status=approved&&repaid=true```
9. Admin can approve or reject a client’s loan application. [done] ```PUT``` on ```localhost:8000/api/v1/loans/:id```
10. User can view loan repayment history. [done] ```GET``` on ```localhost:8000/api/v1/repayments```


## Project Links:
1. The live demo for this project can be found at: 
   https://nkalyesubula.github.io/QuickCredit/

2. Github repository can be found at:
   https://github.com/nkalyesubula/QuickCredit/

3. PivotalTracker link: https://www.pivotaltracker.com/n/projects/2326718

4. Heroku link: https://quickcreditapi.herokuapp.com/api/v1/loans



## Project usage:
The project has an admin and users.

<!--admin login credentials-->
#### Admin credentials
email:admin@admin.com
password:admin1234

<!--user login credentials-->
#### User credentials
email:user@user.com
password:user1234

## Configuration instructions:
For one to use this application, the person needs to have a computer with a browser and a steady internet connection.
