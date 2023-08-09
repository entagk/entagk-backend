const path = require('path');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../../server');

const { getData, setData } = require("./utils");
const validateAuth = require('../validateAuth');

module.exports = () => describe("Testing updateUser PATCH route /api/user/update_user", () => {
  const utilsPath = path.resolve(__dirname, 'utils');
  validateAuth("/api/user/update_user", 'patch', utilsPath);

  it("Sending request without data", (done) => {
    supertest(app)
    ["patch"]("/api/user/update_user")
      .set("Authorization", `Bearer ${getData('token')}`)
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("Please enter the new data");

        done();
      })
  })

  it("Sending correct data", (done) => {
    const newName = "testing987";
    supertest(app)
      .patch("/api/user/update_user")
      .set("Authorization", `Bearer ${getData('token')}`)
      .send({ name: newName })
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("Successfuly updates");
        expect(res.body.afterUpdatae.name).toBe(newName);

        done();
      })
  })

  it("Sending invalid old password", (done) => {
    const newPass = "testing987";
    supertest(app)
      .patch("/api/user/update_user")
      .set("Authorization", `Bearer ${getData('token')}`)
      .send({ newPassword: newPass, oldPassword: "dfjksf" })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.oldPassword).toBe("The old password does not match.");

        done();
      })
  });

  it("Sending invalid new password", (done) => {
    const userData = getData('userData');
    supertest(app)
      .patch("/api/user/update_user")
      .set("Authorization", `Bearer ${getData('token')}`)
      .send({ newPassword: "fdsf d", oldPassword: userData.password })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.newPassword).toBe("The password shouldn't be less than 8 letter or numbers");

        done();
      })
  });

  it("Reset password using updateUser controller", (done) => {
    const newPass = "testing987";
    const userData = getData('userData');
    supertest(app)
      .patch("/api/user/update_user")
      .set("Authorization", `Bearer ${getData('token')}`)
      .send({ newPassword: newPass, oldPassword: userData.password })
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("Successfuly updates");
        userData.password = newPass;
        setData("userData", userData);

        done();
      })
  });

  it("Login after password reseting", (done) => {
    const userData = getData('userData');
    supertest(app)
      .post('/api/user/signin')
      .send({...userData, password: "testing987"})
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("You are logged in successfully");

        const token = res.body.access_token;
        setData('token', token);
        if (token.length < 500) {
          const tokenData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
          expect(mongoose.Types.ObjectId.isValid(tokenData.id)).toBe(true);
        } else {
          const tokenData = jwt.decode(token);
          expect(mongoose.Types.ObjectId.isValid(tokenData.sub)).toBe(true);
        }

        done();
      })
  });
});
