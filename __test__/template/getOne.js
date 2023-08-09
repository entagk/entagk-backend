const supertest = require("supertest");
const app = require("../../server");
const { getData } = require("./utils");

module.exports = () => describe("Testing getOne controller", () => {
  it("get public template", (done) => {
    const templateData = getData('templateData');
    supertest(app)
      .get(`/api/template/one/${templateData[0]._id}`)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body).toEqual(templateData[0]);

        done();
      });
  });

  it("get private template", (done) => {
    const templateData = getData('templateData');
    supertest(app)
      .get(`/api/template/one/private/${templateData[1]._id}`)
      .set("Authorization", `Bearer ${getData("token")}`)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body).toEqual(templateData[1]);

        done();
      });
  });

  it("send invalid id using route /api/template/one/privite/djs21dsf", (done) => {
    supertest(app)
      .get(`/api/template/one/private/djs21dsf`)
      .set("Authorization", `Bearer ${getData("token")}`)
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("Invalid id");

        done();
      });
  });

  it("send not found template id using route /api/template/one/privite/63e0180ebb43b174201482a0", (done) => {
    supertest(app)
      .get(`/api/template/one/private/63e0180ebb43b174201482a0`)
      .set("Authorization", `Bearer ${getData("token")}`)
      .expect(404)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("This template doesn't found.");

        done();
      });
  });

  it("get private template using route /api/template/one/63e0180ebb43b174201482a0", (done) => {
    const templateData = getData('templateData');
    supertest(app)
      .get(`/api/template/one/${templateData[1]._id}`)
      .set("Authorization", `Bearer ${getData("token")}`)
      .expect(405)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("Not allow for you.");

        done();
      });
  });
});
