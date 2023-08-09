const supertest = require('supertest');
const app = require('./../../server');

const { getData } = require("./utils");

module.exports = () => describe("Testing forgotPassword POST through route /api/user/forgot_password", () => {
  it("Testing forgotPassword controller with invalid email and then return error message", (done) => {
    supertest(app)
      .post('/api/user/forgot_password')
      .send({ email: "kjdsafk" })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.errors.email).toBe('This email is invalid');
        done();
      })
  })

  it("Testing forgotPassword controller with not founded email and then return error message", (done) => {
    supertest(app)
      .post('/api/user/forgot_password')
      .send({ email: "kjdsafk@fkjd.come" })
      .expect(404)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.email).toBe("This email is not found");

        done();
      })
  })

  it("Testing forgotPassword controller and return success message", (done) => {
    const userData = getData('userData');
    supertest(app)
      .post('/api/user/forgot_password')
      .send({ email: userData.email })
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("checkout your email.");
        expect(res.body.result.accepted[0]).toBe(userData.email);

        resetTokenId = res.body.result.ResetId;

        done();
      })
  })
});
