const path = require('path');
const supertest = require('supertest');
const app = require('../../server');

const { test, getData, setData } = require('./utils');

const validateAuth = require('../validateAuth')
module.exports = () => describe("Testing addTask controller route /api/task/add/", () => {
  const utilsPath = path.resolve(__dirname, 'utils.js');
  validateAuth('/api/task/', 'get', utilsPath)

  const taskData = getData('taskData');

  it("Sending request without sending data", (done) => {
    supertest(app)
      .post('/api/task/add/')
      .set("Authorization", `Bearer ${getData('token')}`)
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.name).toBe("This field is required")
        expect(res.body.errors.est).toBe("This field is required");

        done();
      })
  });

  it("Sending invalid est", (done) => {
    supertest(app)
      .post('/api/task/add/')
      .set("Authorization", `Bearer ${getData('token')}`)
      .send({ name: "test1", est: -1 })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.est).toBe("The est shouldn't be negative number.");

        done();
      })
  });

  it("Sending invalid name", (done) => {
    supertest(app)
      .post('/api/task/add/')
      .set("Authorization", `Bearer ${getData('token')}`)
      .send({ name: "test1".repeat(50), est: 2 })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.name).toBe("The name length is more than 50 characters.");

        done();
      })
  });

  it("Sending invalid notes", (done) => {
    supertest(app)
      .post('/api/task/add/')
      .set("Authorization", `Bearer ${getData('token')}`)
      .send({ name: "test1", est: 2, notes: "test1".repeat(500) })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.notes).toBe("The notes length is more than 500 characters.");

        done();
      })
  });

  it('Sending invalid type', (done) => {
    supertest(app)
      .post('/api/task/add/')
      .set("Authorization", `Bearer ${getData('token')}`)
      .send({ name: "test1", est: 2, type: { name: "kdsaj", code: "kdsj" } })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("Invalid task type");

        done();
      })
  })

  it('Sending invalid template', (done) => {
    supertest(app)
      .post('/api/task/add/')
      .set("Authorization", `Bearer ${getData('token')}`)
      .send({ name: "test1", est: 2, template: "template_id" })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("Invalid template");

        done();
      });
  });

  it("Sending valid data", (done) => {
    supertest(app)
      .post('/api/task/add/')
      .set("Authorization", `Bearer ${getData('token')}`)
      .send(taskData[0])
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        const data = res.body;

        const userId = getData('userId')
        test(data, { userId, check: false, notes: taskData[0].notes, act: 0, est: taskData[0].est, name: taskData[0].name, _id: taskData[0]._id });

        taskData[0] = data;
        setData('taskData', taskData);

        done();
      })
  });

  it("get all tasks", (done) => {
    supertest(app)
      .get("/api/task/")
      .set("Authorization", `Bearer ${getData('token')}`)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        const data = res.body;

        test(data, {
          tasks: taskData,
          total: 1,
          currentPage: 1,
          numberOfPages: 1
        });

        done();
      })
  });
});
