const supertest = require("supertest");
const app = require("../../server");
const { getData, setData } = require("./utils");

const path = require('path');
const validateAuth = require('../validateAuth');

module.exports = () => describe("Update template tasks", () => {
  const utilsPath = path.resolve(__dirname, 'utils');
  validateAuth('/api/user/delete_user', 'delete', utilsPath);

  it("Update task", (done) => {
    const updatedTask = { name: "Updated task", act: 5 };
    const templateTasks = getData('templateTasks');
    supertest(app)
      .patch(`/api/task/update/${templateTasks[0].tasks[2]._id}`)
      .set("Authorization", `Bearer ${getData('token')}`)
      .send(updatedTask)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        const data = res.body;

        delete data.updatedAt;
        delete data.createdAt;
        const newTask = { ...templateTasks[0].tasks[2], ...updatedTask };
        delete newTask.updatedAt;
        delete newTask.createdAt;
        expect(data).toEqual(newTask);

        templateTasks[0].tasks[2] = data;
        setData('templateTasks', templateTasks);

        done();
      });
  });

  it("verifying updated task", (done) => {
    const templateTasks = getData('templateTasks');
    const templateData = getData('templateData');
    supertest(app)
      .get(`/api/template/one/tasks/private/${templateData[0]._id}`)
      .set("Authorization", `Bearer ${getData('token')}`)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        const data = res.body.tasks[2];

        delete data.updatedAt;
        delete data.createdAt;

        delete templateTasks[0].tasks[2].updatedAt;
        delete templateTasks[0].tasks[2].createdAt;

        expect(data).toEqual(templateTasks[0].tasks[2]);

        done();
      })
  });
})
