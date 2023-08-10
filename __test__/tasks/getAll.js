const path = require('path');
const supertest = require('supertest');
const app = require('../../server');

const { test, getData } = require('./utils');
const validateAuth = require('../validateAuth');

module.exports = () => describe("Testing getAll controller route /api/task/", () => {
  const utilsPath = path.resolve(__dirname, 'utils.js');
  validateAuth('/api/task/', 'get', utilsPath)

  it("get all tasks", (done) => {
    supertest(app)
      .get("/api/task/")
      .set("Authorization", `Bearer ${getData('token')}`)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        const data = res.body;

        test(data, { tasks: [], total: 0, currentPage: 0, numberOfPages: 0 })

        done();
      })
  });
});
