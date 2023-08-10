const path = require('path');
const supertest = require('supertest');
const app = require('../../server');

const { test, getData, setData, initializeData } = require('./utils');

const validateAuth = require('../validateAuth');

const userData = { name: "testing123", email: "testing123@test.com", password: "testing123" };

module.exports = () => describe("Testing checkTask controller route /api/task/check/:id", () => {
  const utilsPath = path.resolve(__dirname, 'utils.js');
  validateAuth('/api/task/', 'get', utilsPath)

  it("Send request with invalid id", (done) => {
    supertest(app)
      .post(`/api/task/check/dfjdsfkewejriek`)
      .set("Authorization", `Bearer ${getData('token')}`)
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("Invalid id");

        done();
      })
  })

  it('Send id for not found task', (done) => {
    supertest(app)
      .post(`/api/task/check/637433baec806fe7624d1447`)
      .set("Authorization", `Bearer ${getData('token')}`)
      .send({ ...userData, est: 5 })
      .expect(404)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("This task doesn't found.");

        done();
      })
  })

  initializeData("taskData");
  const taskData = getData('taskData');
  it("Add new task", (done) => {
    supertest(app)
      .post('/api/task/add/')
      .set("Authorization", `Bearer ${getData('token')}`)
      .send(taskData[0])
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        const data = res.body;

        test(data, { userId, check: false, notes: taskData[0].notes, act: 0, est: taskData[0].est, name: taskData[0].name });

        taskData[0] = data;
        setData('taskData', taskData);

        done();
      })
  })

  it("check task", (done) => {
    const taskData = getData('taskData')
    supertest(app)
      .post(`/api/task/check/${taskData[0]._id}`)
      .set("Authorization", `Bearer ${getData('token')}`)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        const data = res.body;

        test(data, { act: taskData[0].est, check: true });

        done();
      })
  })
});
