const path = require('path');
const supertest = require('supertest');
const app = require('../../server');

const { test, getData } = require('./utils');

const userData = { name: "testing123", email: "testing123@test.com", password: "testing123" };

const validateAuth = require('../validateAuth');

module.exports = () => describe("Testing increaseAct controller route /api/task/increase_act/:id", () => {
  const utilsPath = path.resolve(__dirname, 'utils.js');
  validateAuth('/api/task/', 'get', utilsPath)

  it("Send request with invalid id", (done) => {
    supertest(app)
      .post(`/api/task/increase_act/dfjdsfkewejriek`)
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
      .post(`/api/task/increase_act/637433baec806fe7624d1447`)
      .set("Authorization", `Bearer ${getData('token')}`)
      .send({ ...userData, est: 5 })
      .expect(404)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("This task doesn't found.");

        done();
      })
  })

  it("increaseAct a checked task", (done) => {
    supertest(app)
      .post(`/api/task/increase_act/${getData("taskData")[0]._id}`)
      .set("Authorization", `Bearer ${getData('token')}`)
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        const data = res.body;

        expect(data.message).toBe("This task is completed.");

        done();
      })
  });

  it("uncheck task", (done) => {
    supertest(app)
      .post(`/api/task/check/${getData("taskData")[0]._id}`)
      .set("Authorization", `Bearer ${getData('token')}`)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        const data = res.body;

        expect(data.act).toBe(0);
        expect(data.check).toBe(false);

        done();
      })
  })

  it("increaseAct a unchecked task", (done) => {
    const taskData = getData("taskData");
    supertest(app)
      .post(`/api/task/increase_act/${taskData[0]._id}`)
      .set("Authorization", `Bearer ${getData('token')}`)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        const data = res.body;

        test(data, {
          userId,
          check: false,
          project: "",
          notes: taskData[0].notes,
          act: 1,
          name: taskData[0].name,
          _id: taskData[0]._id
        });

        done();
      })
  });
});
