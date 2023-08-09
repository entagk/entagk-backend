const supertest = require("supertest");
const app = require("../../server");
const { getData, setData, verifyTasks } = require("./utils");

const sendInvalidId = (url) => {
  it(`send invalid id using route ${url}/fdfdsfdf`, (done) => {
    supertest(app)
      .get(`${url}/fdfdsfdf`)
      .set("Authorization", `Bearer ${getData("token")}`)
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("Invalid id");

        done();
      });
  });
}

const testUnFoundTemplate = (url) => {
  it(`send not found template id using route ${url}/63e0180ebb43b174201482a0`, (done) => {
    supertest(app)
      .get(`${url}/63e0180ebb43b174201482a0`)
      .set("Authorization", `Bearer ${getData("token")}`)
      .expect(404)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("This template doesn't found.");

        done();
      });
  });
}

module.exports = () => describe("Testing getting template tasks controller", () => {
  sendInvalidId("/api/template/one/tasks");
  testUnFoundTemplate('/api/template/one/tasks')

  it("get tasks from public template", (done) => {
    const templateData = getData('templateData');
    const templateTasks = getData('templateTasks');
    supertest(app)
      .get(`/api/template/one/tasks/${templateData[0]._id}`)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        verifyTasks(res.body.tasks, templateData[0], templateTasks[0].tasks);

        templateTasks[0] = res.body;
        setData('templateTasks', templateTasks);

        done();
      });
  });

  sendInvalidId("/api/template/one/tasks/private");
  testUnFoundTemplate('/api/template/one/tasks/private');

  it("get tasks from private template", (done) => {
    const templateData = getData('templateData');
    const templateTasks = getData('templateTasks');
    supertest(app)
      .get(`/api/template/one/tasks/private/${templateData[1]._id}`)
      .set("Authorization", `Bearer ${getData("token")}`)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        verifyTasks(res.body.tasks, templateData[1], templateTasks[1].tasks);
        done();
      });
  });

  it("get tasks from private template using route /api/template/one/tasks/63e0180ebb43b174201482a0", (done) => {
    const templateData = getData('templateData');
    supertest(app)
      .get(`/api/template/one/tasks/${templateData[1]._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(405)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("Not allow for you.");

        done();
      });
  });
});
