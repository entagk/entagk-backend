const supertest = require("supertest");
const app = require("../../server");
const { verifyForMultiple, getData } = require("./utils");

const path = require('path');
const validateAuth = require('../validateAuth');

module.exports = () => describe("Testing getAll controller for route /api/template/", () => {
  const utilsPath = path.resolve(__dirname, 'utils');
  validateAuth('/api/user/delete_user', 'delete', utilsPath);

  it("Sending vaild getAll request", (done) => {
    const templateData = getData('templateData');
    supertest(app)
      .get("/api/template/")
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        verifyForMultiple(res.body, templateData.filter(t => t.visibility));

        done();
      })
  })

  it("search request", (done) => {
    const templateData = getData('templateData')
    supertest(app)
      .get(`/api/template/?search=${'template is'}`)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        verifyForMultiple(res.body, templateData.filter(t => t.visibility))

        done();
      })
  })
})
