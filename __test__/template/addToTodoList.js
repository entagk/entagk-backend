const supertest = require("supertest");
const app = require("../../server");
const { getData, setData, verifyTemplateData } = require("./utils");

const path = require('path');
const validateAuth = require('../validateAuth');
module.exports = () => describe("Testing add template to todo list using route /api/template/toto/:id", () => {
  const utilsPath = path.resolve(__dirname, 'utils');
  validateAuth('/api/user/delete_user', 'delete', utilsPath);

  it("Sending invalid template id", (done) => {
    supertest(app)
      .post(`/api/template/todo/dsfdsafasf`)
      .set("Authorization", `Bearer ${getData("token")}`)
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("Invalid id");

        done();
      });
  });

  it("Sending not template id", (done) => {
    const templateData = getData('templateData')
    supertest(app)
      .post(`/api/template/todo/${templateData[0].tasks[0]}`)
      .set("Authorization", `Bearer ${getData("token")}`)
      .expect(404)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("This template doesn't found.");

        done();
      });
  })

  it("Sending valid template id", (done) => {
    const order = 0;
    const templateData = getData('templateData');
    supertest(app)
      .post(`/api/template/todo/${templateData[0]._id}`)
      .send({ order: order })
      .set("Authorization", `Bearer ${getData("token")}`)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        delete templateData[0].updatedAt;
        delete templateData[0].createdAt;
        verifyTemplateData(res.body, { ...templateData[0], visibility: false, act: 0, userId: userId, order: order })

        setData('todoTemplate', res.body, 0);

        done();
      })
  });
});
