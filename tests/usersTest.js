var app = require("../server");
var supertest = require("supertest");
var should = require("should");

var server = supertest.agent(app);

describe("register user on /api/v1/auth/signup POST", function(){
  it("should return 201 response code", function(){
    server
    .post('api/v1/auth/signup')
    .send({
            firstName :"noah",
            lastName:"kalyesubula",password:"1234567",email:"noahkalyesubula@gmail.com",address:"Kyengera",isAdmin: true
          })
    .expect("Content-type",/json/)
    .expect(201)
    .end(function(err,res){
      res.status.should.equal(201);
    });
  });
});




















// // Import the dependencies for testing
// var server = require('../server');
// var chai = require('chai');
// var chaiHttp = require('chai-http');

// const should = require('should');

// chai.use(chaiHttp);
// chai.should();



// // Sign Up Unit Tests
// describe('register user on /api/v1/auth/signup POST',function () {
// it('should return 201 response code', function(done) {
//     chai.request(server)
//       .post('api/v1/auth/signup')
//       .send({
//             firstName :"noah",
//             lastName:"kalyesubula",password:"1234567",email:"noahkalyesubula@gmail.com",address:"Kyengera",isAdmin: true
//             })
//       .end(function(err, res){
        // res.should.have.status(201);
        // res.should.be.json;
        // should(res.body).be.a('object');
        //res.body.should.have.property('data');
        // res.body.data.should.be.a('object');
        // res.body.data.should.have.property('token');
        // res.body.data.should.have.property('id');
        // res.body.data.should.have.property('email');
        // res.body.data.should.have.property('firstName');
        // res.body.data.should.have.property('lastName');
        // res.body.data.should.have.property('status');
        // res.body.data.should.have.property('isAdmin');
        // res.body.data.should.have.property('status');
        // res.body.data.firstName.should.equal('noah');
        // res.body.data.lastName.should.equal('kalyesubula');
        // res.body.data.isAdmin.should.equal(true);
//         done();
//       });
//   });
// });

// // Login Unit Tests
// describe('Login user',function () {
//     it('should return 200 response code', function (done) {
//         request.post(endpoint+'auth/signin', {json: true, body: {
//           email:"noahkalyesubula@gmail.com",password:"1234567"
//           }}, function (error, response) {
//             expect(response.statusCode).toEqual(200);
//             // server_response = JSON.parse(body);
//             // token =  server_response.data.token;
//             done();
//         });
//     });

//     it('should fail on POST', function (done) {
//         request.post(endpoint+'auth/signup', {json: true, body: {}}, function (error, response) {
//             expect(response.statusCode).toEqual(400);
//             done();
//         });
//     });
// });

//Mark As Verified Unit Tests
// describe('Mark User As Verified',function () {
//     it('should return 200 response code', function (done) {
//         request.post(endpoint+'noahkalyesubula@gmail.com/verify', {json: true, body: {}}, function (error, response) {
//             expect(response.statusCode).toEqual(200);
//             done();
//         });
//     });

//     it('should fail on POST', function (done) {
//         request.post(endpoint+'email@email.com/verify', {json: true, body: {}}, function (error, response) {
//             expect(response.statusCode).toEqual(404);
//             done();
//         });
//     });
// });
    