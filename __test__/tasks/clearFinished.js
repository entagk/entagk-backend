const path = require('path');
const supertest = require('supertest');
const app = require('../../server');

const { test, getData, setData } = require('./utils');

const validateAuth = require('../validateAuth');

module.exports = () => describe("Testing clearFinished controller route /api/task/clear_finished/", () => {
  const utilsPath = path.resolve(__dirname, 'utils.js');
  validateAuth('/api/task/', 'get', utilsPath);

  it("Add two tasks", (done) => {
    const taskData = getData('taskData');
    supertest(app)
      .post('/api/task/add_multiple_tasks')
      .set("Authorization", `Bearer ${getData('token')}`)
      .send([{ ...taskData[0], est: 9 }, { ...taskData[0], est: 5 }])
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        const data = res.body;

        const userId = getData('userId');

        test(data[0], { userId, check: false, notes: taskData[0].notes, act: 0, est: 9, name: taskData[0].name });
        test(data[1], { userId, check: false, notes: taskData[0].notes, act: 0, est: 5, name: taskData[0].name });

        taskData[1] = data[0];
        taskData[2] = data[1];
        setData('taskData', taskData);

        done();
      })
  })

  it("check task", (done) => {
    const taskData = getData('taskData');
    supertest(app)
      .post(`/api/task/check/${taskData[1]._id}`)
      .set("Authorization", `Bearer ${getData('token')}`)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        const data = res.body;

        test(data, { check: true, act: taskData[1].est });

        taskData[1] = data;

        setData('taskData', taskData);

        done();
      })
  })

  it("clear finished tasks", (done) => {
    const taskData = getData('taskData');
    supertest(app)
      .delete('/api/task/clear_finished/')
      .set('Authorization', `Bearer ${getData('token')}`)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("Success deleted.")
        expect(res.body.deletedCount).toBe(taskData.filter(t => t.check).length);

        setData('taskData', taskData.filter(task => !task?.check));

        done();
      })
  })
});
