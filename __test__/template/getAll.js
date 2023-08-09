const supertest = require("supertest");
const app = require("../../server");
const { verifyForMultiple, getData } = require("./utils");

module.exports = () => describe("Testing getAll controller for route /api/template/", () => {
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
