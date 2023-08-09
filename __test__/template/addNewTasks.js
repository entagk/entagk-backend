const supertest = require("supertest");
const app = require("../../server");
const mongoose = require('mongoose')
const { getData, setData } = require("./utils");

module.exports = () => describe("Adding new task for a template", () => {
  const taskData = [{ name: "new task", est: 10 }];
  it("adding task", (done) => {
    const templateData = getData('templateData');
    const templateTasks = getData('templateTasks');
    supertest(app)
      .post('/api/task/add/')
      .set("Authorization", `Bearer ${getData('token')}`)
      .send({
        ...taskData[0],
        template:
          { _id: templateData[0]._id, todo: templateData[0].todo }
      })
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        const data = res.body;

        templateData[0].tasks.push(data._id);

        expect(mongoose.Types.ObjectId.isValid(data._id)).toBe(true);
        expect(data.name).toBe(taskData[0].name);
        expect(data.est).toBe(taskData[0].est);
        expect(data.act).toBe(0);
        expect(data.notes).toBe("");
        expect(data.check).toBe(false);
        expect(data.template._id).toBe(templateData[0]._id);

        setData('templateData', templateData);

        templateTasks[0].tasks.push(data);
        setData('templateTasks', templateTasks);

        done();
      });
  });

  it("verifying task adding", (done) => {
    const templateData = getData('templateData');
    const templateTasks = getData('templateTasks');
    supertest(app)
      .get(`/api/template/one/tasks/private/${templateData[0]._id}`)
      .set("Authorization", `Bearer ${getData('token')}`)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.tasks[2]).toEqual(templateTasks[0].tasks[2]);

        done();
      })
  });
});
