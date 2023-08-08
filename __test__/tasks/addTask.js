const supertest = require('supertest');
const app = require('../../server');

const { test, getTokenAndUserId, setTaskData, getTaskData } = require('./utils');

module.exports = () => describe("Testing addTask controller route /api/task/add/", () => {
  const taskData = getTaskData();

  it("Sending request without sending data", (done) => {
    supertest(app)
      .post('/api/task/add/')
      .set("Authorization", `Bearer ${getTokenAndUserId().token}`)
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
      .set("Authorization", `Bearer ${getTokenAndUserId().token}`)
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
      .set("Authorization", `Bearer ${getTokenAndUserId().token}`)
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
      .set("Authorization", `Bearer ${getTokenAndUserId().token}`)
      .send({ name: "test1", est: 2, notes: "test1".repeat(500) })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.notes).toBe("The notes length is more than 500 characters.");

        done();
      })
  });

  it("Sending valid data", (done) => {
    supertest(app)
      .post('/api/task/add/')
      .set("Authorization", `Bearer ${getTokenAndUserId().token}`)
      .send(taskData[0])
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        const data = res.body;

        const { userId } = getTokenAndUserId();
        test(data, { userId, check: false, notes: taskData[0].notes, act: 0, est: taskData[0].est, name: taskData[0].name, _id: taskData[0]._id });

        setTaskData(Object.assign(taskData[0], data), 0);
        taskData[0] = Object.assign(taskData[0], data);

        done();
      })
  });

  it("get all tasks", (done) => {
    supertest(app)
      .get("/api/task/")
      .set("Authorization", `Bearer ${getTokenAndUserId().token}`)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        const data = res.body;

        test(data, { tasks: taskData, total: 1, currentPage: 1, numberOfPages: 1 });

        done();
      })
  });
});
