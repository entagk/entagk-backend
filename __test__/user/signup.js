const app = require('../../server');
const mongoose = require('mongoose');
const supertest = require('supertest');
const jwt = require('jsonwebtoken');

const { getData } = require("./utils");

module.exports = () => describe('testing Signup POST through route /api/user/signup', () => {
  const userData = getData('userData');

  it("Testing sending without data and it should return error message and statusCode is 400", (done) => {
    supertest(app)
      .post('/api/user/signup')
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.name).toBe("This field is required");
        expect(res.body.errors.email).toBe("This field is required");
        expect(res.body.errors.password).toBe("This field is required");

        done();
      })
  });

  it("Testing sending invalid email and it should return error message and statusCode is 400", (done) => {
    supertest(app)
      .post('/api/user/signup')
      .send({ ...userData, email: "testing123" })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.email).toBe('This email is invalid');

        done();
      })
  });

  it("Testing sending invalid password and it should return error message and statusCode is 400", (done) => {
    supertest(app)
      .post('/api/user/signup')
      .send({ ...userData, password: "test" })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.password).toBe('The password must be at least 8 letters and numbers');

        done();
      });
  });

  it("Testing sending data and it should return success message and token", (done) => {
    supertest(app)
      .post('/api/user/signup')
      .send(userData)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe('You are logged in successfully');

        if (res.body.access_token.length < 500) {
          const tokenData = jwt.verify(res.body.access_token, process.env.ACCESS_TOKEN_SECRET);
          expect(mongoose.Types.ObjectId.isValid(tokenData.id)).toBe(true);
          userId = tokenData.id;
        } else {
          const tokenData = jwt.decode(res.body.access_token);
          expect(mongoose.Types.ObjectId.isValid(tokenData.sub)).toBe(true);
          userId = tokenData.sub;
        }

        done();
      });
  });

  it("Testing sending old user data and it should return error message with statusCode 400", (done) => {
    supertest(app)
      .post('/api/user/signup') // 'This email is invalid'
      .send({ ...userData })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe('This email already exists');

        done();
      });
  });
});
