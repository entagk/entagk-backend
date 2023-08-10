const supertest = require("supertest");
const app = require("../../server");
const { getData, verifyDeleting, setData } = require("./utils");

const path = require('path');
const validateAuth = require('../validateAuth');

module.exports = () => describe("Testing delete template using DELETE method & route /api/template/:id", () => {
  const utilsPath = path.resolve(__dirname, 'utils');
  validateAuth('/api/user/delete_user', 'delete', utilsPath);

  let deletedId;
  let deletedTodo;
  it("Sending invalid template id", (done) => {
    supertest(app)
      .delete(`/api/template/dsfdsafasf`)
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
      .delete(`/api/template/${templateData[0].tasks[0]}`)
      .set("Authorization", `Bearer ${getData("token")}`)
      .expect(404)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("This template doesn't found.");

        done();
      });
  });

  it("Delete Public template", (done) => {
    const templateData = getData('templateData');
    supertest(app)
      .delete(`/api/template/${templateData[0]._id}`)
      .set("Authorization", `Bearer ${getData("token")}`)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        verifyDeleting(res.body, templateData[0]);

        deletedId = templateData[0]._id;
        setData('templateData', templateData.filter(t => t._id !== templateData[0]._id));

        done();
      });
  });

  it("validing deleted template", (done) => {
    supertest(app)
      .get(`/api/template/one/private/${deletedId}`)
      .set("Authorization", `Bearer ${getData("token")}`)
      .expect(404)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("This template doesn't found.");

        done();
      });
  });

  it("validating tasks deleting", (done) => {
    supertest(app)
      .get(`/api/template/one/tasks/private/${deletedId}`)
      .set("Authorization", `Bearer ${getData("token")}`)
      .expect(404)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("This template doesn't found.");

        done();
      });
  });

  it("Delete Todo list template", (done) => {
    const todoTemplate = getData('todoTemplate');
    supertest(app)
      .delete(`/api/task/delete/${todoTemplate[0]._id}`)
      .set("Authorization", `Bearer ${getData("token")}`)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.deleted_id).toBe(todoTemplate[0]._id);
        expect(res.body.message).toBe("Successfully deleted")

        deletedTodo = res.body.deleted_id;

        setData('todoTemplate', todoTemplate.filter(t => t._id !== todoTemplate[0]._id));

        done();
      });
  });

  it("validing deleted todo list template", (done) => {
    supertest(app)
      .get(`/api/template/one/private/${deletedTodo}`)
      .set("Authorization", `Bearer ${getData("token")}`)
      .expect(404)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("This template doesn't found.");

        done();
      });
  });

  it("validating tasks deleting for todo list template", (done) => {
    supertest(app)
      .get(`/api/template/one/tasks/private/${deletedTodo}`)
      .set("Authorization", `Bearer ${getData("token")}`)
      .expect(404)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("This template doesn't found.");

        done();
      });
  });
});
