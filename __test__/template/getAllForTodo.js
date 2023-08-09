const supertest = require("supertest");
const app = require("../../server");
const { getData, setData, verifyTasks, verifyForMultiple } = require("./utils");

module.exports = () => describe("Testing get todo templates using route /api/template/todo/", () => {
  it("Send request without token", (done) => {
    supertest(app)
      .get("/api/template/todo")
      .expect(401)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("Invalid Authentication.");

        done();
      })
  });

  it("Send request with invalid token", (done) => {
    supertest(app)
      .get("/api/template/todo")
      .set("Authorization", `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QwMTIzQGV4YW1wbGUuY29tIiwiaWQiOiI2MzhjMTE2NDI1ZGI3OGI1MGJjYzFjMDgiLCJpYXQiOjE2NzEwMzE5NzMsImV4cCI6MTY3MTA4OTU3M30.6lafCmgJDX393gGNakvwPbprgCHvrvVIXxUC3wSmxMg`)
      .expect(401)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("Invalid Authentication and jwt expired");

        done();
      })
  });

  it("Valid User", (done) => {
    supertest(app)
      .get("/api/template/todo")
      .set("Authorization", `Bearer ${getData("token")}`)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        const todoTemplate = getData('todoTemplate');

        verifyForMultiple(res.body, todoTemplate);

        done();
      })
  });
});
