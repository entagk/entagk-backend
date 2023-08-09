const path = require('path');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../../server');

const { getData } = require("./utils");
const validateAuth = require('../validateAuth');

module.exports = () => describe("Testing GetUser GET through route /api/user/user_info", () => {
  const utilsPath = path.resolve(__dirname, 'utils');
  validateAuth('/api/user/user_info', 'get', utilsPath);

  it("Testing sending request with token", (done) => {
    const token = getData('token');
    const userData = getData('userData');
    supertest(app)
      .get('/api/user/user_info')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        const data = res.body;
        expect(mongoose.Types.ObjectId.isValid(data._id)).toBe(true);
        expect(data.name).toBe(userData.name);
        expect(data.email).toBe(userData.email);

        done();
      })
  });
});
