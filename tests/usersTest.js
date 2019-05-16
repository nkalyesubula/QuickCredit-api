const app = require("../server");
const supertest = require("supertest");
const should = require("should");

const server = supertest.agent(app);
const userToken = '';
const adminToken = '';

/////////////////////////////////Register user/////////////////////////////////////////////////////
describe("register user on /api/v1/auth/signup POST", function(){
  it("should return 201 response code", function(){
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
  it("should return 201 response code", function(){
    server
    .post('/api/v1/auth/signin')
    .send({
           password:"1234567",email:"noahkalyesubula@gmail.com"
          })
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
      token = res.body.data['token'];
    });
  });

});

///////////////////////////////// Mark As Verified Unit Tests /////////////////////////////////////////////////////
describe("mark user as verified on /api/v1/users/:email/verify PUT", function(){
  it("should return 201 response code", function(){
    server
    .put('/api/v1/users/noahkalyesubula@gmail.com/verify')
    .send()
    .set('x-access-token', token)
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
    });
  });

});

    