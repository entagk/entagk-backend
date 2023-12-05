const path = require('path');
const supertest = require('supertest');
const app = require('../../server');

const { test, getData } = require('./utils');
const validateAuth = require('../validateAuth');

const userData = { name: "testing123", email: "testing123@test.com", password: "testing123" };

module.exports = () => describe("Testing updateTask controller route /api/task/update/:id", () => {
  const utilsPath = path.resolve(__dirname, 'utils.js');
  validateAuth('/api/task/', 'get', utilsPath)

  it("Send request with invalid id", (done) => {
    supertest(app)
      .patch(`/api/task/update/dfjdsfkewejriek`)
      .set("Authorization", `Bearer ${getData("token")}`)
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("Invalid id");

        done();
      })
  })

  it('Send id for not found task', (done) => {
    supertest(app)
      .patch(`/api/task/update/637433baec806fe7624d1447`)
      .set("Authorization", `Bearer ${getData("token")}`)
      .send({ ...userData, est: 5 })
      .expect(404)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("This task doesn't found.");

        done();
      })
  })

  it("Send request without data", (done) => {
    supertest(app)
      .patch(`/api/task/update/${getData("taskData")[0]._id}`)
      .set("Authorization", `Bearer ${getData("token")}`)
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("Please enter the data that you want to update the task to it.");

        done();
      })
  })

  it("Send invalid est", (done) => {
    supertest(app)
      .patch(`/api/task/update/${getData("taskData")[0]._id}`)
      .set("Authorization", `Bearer ${getData("token")}`)
      .send({ ...userData, est: -1 })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.est).toBe("The est shouldn't be negative number.");

        done();
      })
  })

  it("Send invalid act", (done) => {
    supertest(app)
      .patch(`/api/task/update/${getData("taskData")[0]._id}`)
      .set("Authorization", `Bearer ${getData("token")}`)
      .send({ ...userData, act: -1 })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.act).toBe("The act shouldn't be negative number.");

        done();
      })
  })

  it("Send act more than est", (done) => {
    supertest(app)
      .patch(`/api/task/update/${getData("taskData")[0]._id}`)
      .set("Authorization", `Bearer ${getData("token")}`)
      .send({ ...userData, act: 3 })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.act).toBe("The act shouldn't be more than est.");

        done();
      })
  });

  it("Sending invalid name", (done) => {
    const taskData = getData('taskData');
    supertest(app)
      .patch(`/api/task/update/${taskData[0]._id}`)
      .set("Authorization", `Bearer ${getData("token")}`)
      .send({ ...taskData[0], name: "test1".repeat(50) })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.name).toBe("The name length is more than 50 characters.");

        done();
      })
  });

  it("Sending invalid notes", (done) => {
    const taskData = getData('taskData');
    supertest(app)
      .patch(`/api/task/update/${taskData[0]._id}`)
      .set("Authorization", `Bearer ${getData("token")}`)
      .send({ ...taskData[0], notes: "test1".repeat(500) })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.notes).toBe("The notes length is more than 500 characters.");

        done();
      })
  });

  it('Sending invalid type', (done) => {
    const taskData = getData('taskData');
    supertest(app)
      .patch(`/api/task/update/${taskData[0]._id}`)
      .set("Authorization", `Bearer ${getData("token")}`)
      .send({ ...taskData[0], type: { name: "kdsaj", code: "kdsj" } })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("Invalid task type");

        done();
      })
  });

  it('Sending invalid template', (done) => {
    const taskData = getData('taskData');
    supertest(app)
      .patch(`/api/task/update/${taskData[0]._id}`)
      .set("Authorization", `Bearer ${getData("token")}`)
      .send({ ...taskData[0], template: "template_id" })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("Invalid template");

        done();
      });
  });

  it("Sending valid data", (done) => {
    const taskData = getData('taskData');
    supertest(app)
      .patch(`/api/task/update/${taskData[0]._id}`)
      .set("Authorization", `Bearer ${getData("token")}`)
      .send({ ...taskData[0], name: "test2", act: 1 })
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        const data = res.body;

        test(data, {
          userId,
          check: false,
          notes: taskData[0].notes,
          act: 1,
          est: taskData[0].est,
          name: "test2", _id: taskData[0]._id
        });

        done();
      })
  })
});
