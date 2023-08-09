const app = require('../../server');
const mongoose = require('mongoose');
const supertest = require('supertest');
const jwt = require('jsonwebtoken');

const { getData, setData } = require("./utils");

module.exports = () => describe("Testing Signin POST through route /api/user/signin", () => {
  const notFoundUser = { password: 'kdsfjkjske', email: "kdsfjkjske@test.com" };
  const userData = getData('userData');

  it("Testing sending not found user data and it should return error message and statusCode is 400", (done) => {
    supertest(app)
      .post('/api/user/signin')
      .send({ ...notFoundUser })
      .expect(404)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("user not found");

        done();
      })
  });

  it("Testing sending invalid user data that will return error data", (done) => {
    supertest(app)
      .post('/api/user/signin')
      .send({ ...userData, password: 'ksjfkds' })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.password).toBe("wrong password");

        done();
      })
  });

  it("Testing sending valid user data that will return success message and access token", (done) => {
    supertest(app)
      .post('/api/user/signin')
      .send(userData)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("You are logged in successfully");

        setData('token', res.body.access_token);

        if (res.body.access_token.length < 500) {
          const tokenData = jwt.verify(res.body.access_token, process.env.ACCESS_TOKEN_SECRET);
          expect(mongoose.Types.ObjectId.isValid(tokenData.id)).toBe(true);
          setData('userId', tokenData.id);
        } else {
          const tokenData = jwt.decode(res.body.access_token);
          expect(mongoose.Types.ObjectId.isValid(tokenData.sub)).toBe(true);
          setData('userId', tokenData.sub);
        }

        done();
      })
  });
});
