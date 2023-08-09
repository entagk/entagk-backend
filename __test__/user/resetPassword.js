const supertest = require('supertest');
const app = require('../../server');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')

const { getData, setData } = require("./utils");

module.exports = () => describe("Testing resetPassword POST route /api/user/reset_password", () => {
  it("Testing controller without resetTokenId", (done) => {
    supertest(app)
      .post('/api/user/reset_password')
      .expect(401)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("Invalid Authentication.");

        done();
      })
  });

  it("Testing controller with invalid resetTokenId", (done) => {
    supertest(app)
      .post('/api/user/reset_password')
      .set('Authorization', `Bearer SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`)
      .expect(404)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe('Expired token, please try set password again.');

        done();
      })
  })

  it("without sending password", (done) => {
    supertest(app)
      .post('/api/user/reset_password')
      .set('Authorization', `Bearer ${getData('resetTokenId')}`)
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.password).toBe("Please, enter a valid new password.");

        done();
      })
  })

  it("sending invalid password", (done) => {
    supertest(app)
      .post('/api/user/reset_password')
      .send({ password: "test" })
      .set('Authorization', `Bearer ${getData('resetTokenId')}`)
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.password).toBe("Please, enter a valid new password.");

        done();
      })
  })

  it("Sending valid data", (done) => {
    const newPass = "testing987";
    const userData = getData('userData');
    supertest(app)
    .post('/api/user/reset_password')
    .send({ password: newPass })
    .set('Authorization', `Bearer ${getData('resetTokenId')}`)
    .expect(200)
    .end((err, res) => {
      if (err) throw err;
      
      expect(res.body.message).toBe("The password is changed successfuly.");
      
      userData.password = newPass;
      setData('userData', userData);
      done();
    });
  });
  
  it("Login for testing password reseting", (done) => {
    const userData = getData('userData');
    supertest(app)
      .post('/api/user/signin')
      .send(userData)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("You are logged in successfully");

        setData("token", res.body.access_token);
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
