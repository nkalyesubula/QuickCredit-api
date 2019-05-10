// Import the dependencies for testing
const request = require('request');
const server = require('../server');

const endpoint = 'http://localhost:8000/api/v1/';
let token = null;

// Sign Up Unit Tests
describe('register user',function () {
    it('should return 201 response code', function (done) {
        request.post(endpoint+'auth/signup', {json: true, body: {
          firstName :"noah",
          lastName:"kalyesubula",password:"1234567",email:"noahkalyesubula@gmail.com",address:"Kyengera",isAdmin: true
          }}, function (error, response) {
            expect(response.statusCode).toEqual(201);
            done();
        });
    });

    it('should fail on POST', function (done) {
        request.post(endpoint+'auth/signup', {json: true, body: {}}, function (error, response) {
            expect(response.statusCode).toEqual(400);
            done();
        });
    });
});

// Login Unit Tests
describe('Login user',function () {
    it('should return 200 response code', function (done) {
        request.post(endpoint+'auth/signin', {json: true, body: {
          email:"noahkalyesubula@gmail.com",password:"1234567"
          }}, function (error, response) {
            expect(response.statusCode).toEqual(200);
            // server_response = JSON.parse(body);
            // token =  server_response.data.token;
            done();
        });
    });

    it('should fail on POST', function (done) {
        request.post(endpoint+'auth/signup', {json: true, body: {}}, function (error, response) {
            expect(response.statusCode).toEqual(400);
            done();
        });
    });
});

// Mark As Verified Unit Tests
// describe('Login user',function () {
//     it('should return 200 response code', function (done) {
//         request.post(endpoint+'auth/signin', {json: true, body: {
//           email:"noahkalyesubula@gmail.com",password:"1234567"
//           }}, function (error, response) {
//             expect(response.statusCode).toEqual(200);
//             done();
//         });
//     });

//     it('should fail on POST', function (done) {
//         request.post(endpoint+'auth/signup', {json: true, body: {}}, function (error, response) {
//             expect(response.statusCode).toEqual(response);
//             done();
//         });
//     });
// });
    