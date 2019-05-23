import chai, { expect } from 'chai';
import app from "../server";

chai.use(require('chai-http'));

let userToken;
let adminToken;

let makeEmail = (length)=> {
  var result           = '';
  var characters       = 'abcdefghijklmnopqrstuvwxyz';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const userEmail = makeEmail(5)+'@gmail.com';
const adminEmail = makeEmail(5)+'@gmail.com';





describe('All Routes', () => {

  //register admin
  it('should signup a admin with valid details', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName :"noah",
        lastName:"kalyesubula",
        password:"1234567",
        email: adminEmail,
        address:"Kyengera",
        isAdmin: true
      })
      .then((res) => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        expect(res.body).to.have.property('data').to.be.an('object');
        done();
      })
      .catch(err => done(err));
  });

  //register user
it('should signup a admin with valid details', (done) => {
  chai.request(app)
    .post('/api/v1/auth/signup')
    .send({
      firstName :"john",
      lastName:"doe",
      password:"1234567",
      email:userEmail,
      address:"Kyengera",
      isAdmin: false
    })
    .then((res) => {
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('data');
      expect(res.body).to.have.property('data').to.be.an('object');
      done();
    })
    .catch(err => done(err));
});

//user with invalid details
  it('should not signup a user with invalid details', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        
      })
      .then((res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        done();
      })
      .catch(err => done(err));
  });
  //user with already existing email
  it('should not signup a user with already exist email', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
            firstName :"noah",
            lastName:"kalyesubula",
            password:"1234567",
            email:adminEmail,
            address:"Kyengera",
            isAdmin: true
      })
      .then((res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        done();
      })
      .catch(err => done(err));
  });

  //Login Admin
  it('should login admin', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({ email: adminEmail, password: '1234567' })
      .then((res) => {
        adminToken = res.body.data['token'];
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });

  //Login User
  it('should login user', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({ email: userEmail, password: '1234567' })
      .then((res) => {
        userToken = res.body.data['token'];
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });

  //don't login user with wrong details
  it('should not login user with invalid details', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({ email: adminEmail, password: 'xxxx' })
      .then((res) => {
        expect(res.status).to.be.equal(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        done();
      })
      .catch(error => done(error));
  });

  //verify user
  it('should verify a user', (done) => {
    chai.request(app)
      .put(`/api/v1/users/${userEmail}/verify`)
      .set('x-access-token', adminToken)
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });
  //should not verify wrong email
  it('should not verified a user successfully', (done) => {
    chai.request(app)
      .put('/api/v1/users/jojkiuulary@gmai.com/verify')
      .set('x-access-token', adminToken)
      .then((res) => {
        expect(res.status).to.be.equal(404);
        done();
      })
      .catch(error => done(error));
  });
  it('should not post a loan', (done) => {
    chai.request(app)
      .post('/api/v1/loans')
      .set('x-access-token', userToken)
      .send({ amount: 'fgg', tenor: 0 })
      .then((res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body).to.have.property('status');
        done();
      })
      .catch(error => done(error));
  });
 
  it('should post a loan application', (done) => {
    chai.request(app)
      .post('/api/v1/loans')
      .set('x-access-token', userToken)
      .send({
        "tenor" : 7,
          "amount" : 5000
      })
      .then((res) => {
        expect(res.status).to.be.equal(201);
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });
  //approve or reject loan
  it('should verify a loan application', (done) => {
    chai.request(app)
      .put('/api/v1/loans/1')
      .send({ status: 'approved' })
      .set('x-access-token', adminToken)
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });
  it('should get a specific loan application', (done) => {
    chai.request(app)
      .get('/api/v1/loans/1')
      .set('x-access-token', adminToken)
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });
  it('should not get a specific loan application', (done) => {
    chai.request(app)
      .get('/api/v1/loans/0')
      .set('x-access-token', adminToken)
      .then((res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body).to.have.property('error');
        done();
      })
      .catch(error => done(error));
  });
  it('should get all loan applications', (done) => {
    chai.request(app)
      .get('/api/v1/loans')
      .set('x-access-token', adminToken)
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });

});
