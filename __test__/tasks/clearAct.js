const path = require('path')
const supertest = require('supertest');
const app = require('../../server');

const { test, getData, setData } = require('./utils');
const validateAuth = require('../validateAuth')

module.exports = () => describe("Testing clearAct controller route /api/task/clear_act", () => {
  const utilsPath = path.resolve(__dirname, 'utils.js');
  validateAuth('/api/task/', 'get', utilsPath);

  it("increase act for unchecked task", (done) => {
    const taskData = getData('taskData');
    console.log(taskData);
    supertest(app)
      .patch(`/api/task/update/${taskData[0]._id}`)
      .set("Authorization", `Bearer ${getData('token')}`)
      .send({ act: taskData[0].est - 1 })
      // .expect(200)
      .end((err, res) => {
        if (err) throw err;

        const data = res.body;

        test(data, {
          userId: getData('userId'),
          ...data,
          ...taskData[0],
          updatedAt: data.updatedAt,
          check: false,
          notes: taskData[0].notes,
          act: taskData[0].est - 1,
        });

        taskData[0] = data;
        setData('taskData', taskData);

        done();
      })
  });

  it("check task", (done) => {
    const taskData = getData('taskData');
    supertest(app)
      .post(`/api/task/check/${taskData[1]._id}`)
      .set("Authorization", `Bearer ${getData('token')}`)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        const data = res.body;

        test(data, {
          ...data,
          ...taskData[1],
          userId,
          check: true,
          act: taskData[1].est,
          notes: taskData[0].notes,
          updatedAt: data.updatedAt,
        });
        taskData[1] = data;
        setData('taskData', taskData);

        done();
      })
  });

  it("clear act from tasks", (done) => {
    const taskData = getData('taskData');
    supertest(app)
      .delete('/api/task/clear_act')
      .set("Authorization", `Bearer ${getData('token')}`)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("Successful update.");
        expect(res.body.modifiedCount).toBe(taskData.filter(task => task.act > 0).length)

        done();
      })
  })
});
