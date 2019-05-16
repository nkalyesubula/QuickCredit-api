const app = require("../server");
const supertest = require("supertest");
const should = require("should");

const server = supertest.agent(app);
let userToken = '';
let adminToken = '';

/////////////////////////////////Register user/////////////////////////////////////////////////////
describe("register user on /api/v1/auth/signup POST", function(){
  it("should return 201 response code when registering admin", function(){
    server
    .post('/api/v1/auth/signup')
    .send({
            firstName :"noah",
            lastName:"kalyesubula",password:"1234567",email:"noahkalyesubula@gmail.com",address:"Kyengera",isAdmin: true
          })
    .expect("Content-type",/json/)
    .expect(201)
    .end(function(err,res){
      res.status.should.equal(201);
      res.body.data['id'].should.equal(1);
      res.body.data['firstName'].should.equal('noah');
      res.body.data['lastName'].should.equal('kalyesubula');
      res.body.data['email'].should.equal('noahkalyesubula@gmail.com');
    });
  });

  it("should return 201 response code when registering ordinary user", function(){
    server
    .post('/api/v1/auth/signup')
    .send({
            firstName :"John",
            lastName:"Doe",password:"1234567",email:"johndoe@gmail.com",address:"Kigali",isAdmin: false
          })
    .expect("Content-type",/json/)
    .expect(201)
    .end(function(err,res){
      res.status.should.equal(201);
      res.body.data['id'].should.equal(2);
      res.body.data['firstName'].should.equal('John');
      res.body.data['lastName'].should.equal('Doe');
      res.body.data['email'].should.equal('johndoe@gmail.com');
    });
  });

  it("should fail on POST", function(){
    server
    .post('/api/v1/auth/signup')
    .send({})
    .expect("Content-type",/json/)
    .expect(400)
    .end(function(err,res){
      res.status.should.equal(400);
    });
  });
  });

/////////////////////////////////Login user/////////////////////////////////////////////////////
describe("login user on /api/v1/auth/signin POST", function(){
  it("should return 200 response code on loggin the admin", function(){
    server
    .post('/api/v1/auth/signin')
    .send({
           password:"1234567",email:"noahkalyesubula@gmail.com"
          })
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
      adminToken = res.body.data['token'];
    });
  });

  it("should return 200 response code on logging the ordinary user", function(){
    server
    .post('/api/v1/auth/signin')
    .send({
           password:"1234567",email:"johndoe@gmail.com"
          })
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
      userToken = res.body.data['token'];
    });
  });
  it("should return 404 with wrong email", function(){
    server
    .post('/api/v1/auth/signin')
    .send({
           password:"1234567",email:"nkalyesubula@gmail.com"
          })
    .expect("Content-type",/json/)
    .expect(404)
    .end(function(err,res){
      res.status.should.equal(404);
    });
  });

});

///////////////////////////////// Mark As Verified Unit Tests /////////////////////////////////////////////////////
describe("mark user as verified on /api/v1/users/:email/verify PUT", function(){
  it("should return 201 response code", function(){
    server
    .put('/api/v1/users/johndoe@gmail.com/verify')
    .send()
    .set('x-access-token', adminToken)
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
    });
  });

  it("should fail with wrong password", function(){
    server
    .put('/api/v1/users/www/verify')
    .send()
    .set('x-access-token', adminToken)
    .expect("Content-type",/json/)
    .expect(400)
    .end(function(err,res){
      res.status.should.equal(400);
    });
  });

});

///////////////////////////////// Apply for Loan Unit Tests /////////////////////////////////////////////////////
describe("apply for Loan on /api/v1/loans POST", function(){
  it("should return 201 response code when requesting a loan", function(){
    server
    .post('/api/v1/loans')
    .send({
            "tenor":4, "amount":5000
          })
    .set('x-access-token', userToken)
    .expect("Content-type",/json/)
    .expect(201)
    .end(function(err,res){
    res.status.should.equal(201);
    res.body.data['loanId'].should.equal(1);
    res.body.data['firstName'].should.equal('John');
    res.body.data['lastName'].should.equal('Doe');
    });
  });
  it("should return 400 with wrong parameters", function(){
    server
    .post('/api/v1/loans')
    .send({
          })
    .set('x-access-token', userToken)
    .expect("Content-type",/json/)
    .expect(400)
    .end(function(err,res){
    res.status.should.equal(400);
    });
  });
});

///////////////////////////////// Get Specific Loan Unit Tests /////////////////////////////////////////////////////
describe("get specific loan on api/v1/loans/:id on GET", function(){
  it("should return 200 response code", function(){
    server
    .get('/api/v1/loans/1')
    .send()
    .set('x-access-token', adminToken)
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
    });
  });

  it("should fail with wrong loan ID", function(){
    server
    .get('/api/v1/loans/5')
    .send()
    .set('x-access-token', adminToken)
    .expect("Content-type",/json/)
    .expect(404)
    .end(function(err,res){
      res.status.should.equal(404);
    });
  });

});


///////////////////////////////// Get All LoansTests /////////////////////////////////////////////////////
describe("get all loans on api/v1/loans/ on GET", function(){
  it("should return 200 response code", function(){
    server
    .get('/api/v1/loans')
    .send()
    .set('x-access-token', adminToken)
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
    });
  });

  it("should fail with ordinary user trying to get all loans", function(){
    server
    .get('/api/v1/loans')
    .send()
    .set('x-access-token', userToken)
    .expect("Content-type",/json/)
    .expect(401)
    .end(function(err,res){
      res.status.should.equal(401);
    });
  });

});

