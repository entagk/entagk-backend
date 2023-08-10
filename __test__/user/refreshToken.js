const path = require('path');
const supertest = require('supertest');
const app = require('../../server');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')

const { getData, setData } = require("./utils");

module.exports = () => describe("Testing refreshToken GET route /api/user/refresh_token", () => {
  const utilsPath = path.resolve(__dirname, 'utils');
  require('../validateAuth')("/api/user/refresh_token", 'get', utilsPath);

  it("Sending valid request", (done) => {
    supertest(app)
      ["get"]('/api/user/refresh_token')
      .set('Authorization', `Bearer ${getData('token')}`)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("You are logged in successfully");
        if (res.body.refresh_token.length < 500) {
          const tokenData = jwt.verify(res.body.refresh_token, process.env.ACCESS_TOKEN_SECRET);
          expect(mongoose.Types.ObjectId.isValid(tokenData.id)).toBe(true);
          setData("token", res.body.refresh_token)
        } else {
          const tokenData = jwt.decode(res.body.refresh_token);
          expect(mongoose.Types.ObjectId.isValid(tokenData.sub)).toBe(true);
          setData("token", res.body.refresh_token)
        }

        done();
      })
  })
});
