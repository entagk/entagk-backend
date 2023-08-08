const supertest = require('supertest');
const app = require('../../server');

const { test, getTokenAndUserId } = require('./utils');

module.exports = () => describe("Testing getAll controller route /api/task/", () => {
  it("get all tasks", (done) => {
    supertest(app)
      .get("/api/task/")
      .set("Authorization", `Bearer ${getTokenAndUserId().token}`)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        const data = res.body;

        test(data, { tasks: [], total: 0, currentPage: 0, numberOfPages: 0 })

        done();
      })
  });
});
