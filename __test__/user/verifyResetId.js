const supertest = require('supertest');
const app = require('../../server');

const { getData } = require("./utils");

module.exports = () => describe("Testing verifyResetId POST through route /api/user/verify_reset_id", () => {
  it("Testing controller without resetTokenId", (done) => {
    supertest(app)
      .post('/api/user/verify_reset_id')
      .expect(401)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("Invalid Authentication.");

        done();
      })
  });

  it("Testing controller with invalid resetTokenId", (done) => {
    supertest(app)
      .post('/api/user/verify_reset_id')
      .set('Authorization', `Bearer SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`)
      .expect(404)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe('Expired token, please try set password again.');

        done();
      })
  })

  it("Testing controller with successful message", (done) => {
    const resetTokenId = getData('resetTokenId');
    supertest(app)
      .post('/api/user/verify_reset_id')
      .set('Authorization', `Bearer ${resetTokenId}`)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.verify).toBe(true);
        expect(res.body.message).toBe("Founded user.");

        done();
      })
  });
});
