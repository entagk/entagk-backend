const path = require('path');
const supertest = require('supertest');
const app = require('../../server');

const { test, getData, setData } = require('./utils');

const validateAuth = require('../validateAuth')
module.exports = () => describe("Testing addMultipleTasks controller throug route /api/task/add_multiple_tasks", () => {
  const utilsPath = path.resolve(__dirname, 'utils.js');
  validateAuth('/api/task/', 'get', utilsPath);

  let taskData = getData("taskData");

  it("Send request with object data", (done) => {
    supertest(app)
      .post('/api/task/add_multiple_tasks')
      .set("Authorization", `Bearer ${getData('token')}`)
      .send({ "jj": "jjj", "kk": "kkk" })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("The data have been sent is not array, please try again");

        done();
      })
  });

  it("Send request with empty data", (done) => {
    supertest(app)
      .post('/api/task/add_multiple_tasks')
      .set("Authorization", `Bearer ${getData('token')}`)
      .send([])
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("No data have been sent yet.");

        done();
      })
  });

  it("Send request with empty tasks", (done) => {
    supertest(app)
      .post('/api/task/add_multiple_tasks')
      .set("Authorization", `Bearer ${getData('token')}`)
      .send([{}])
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        test(res.body,
          {
            name: `For task 1, This field is required`,
            est: `For task 1, This field is required`
          }
        );

        done();
      })
  });

  it("Sending invalid est", (done) => {
    supertest(app)
      .post('/api/task/add_multiple_tasks')
      .set("Authorization", `Bearer ${getData('token')}`)
      .send([{ name: "test1", est: -1 }])
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.est).toBe("For task 1, The est shouldn't be negative number.");

        done();
      })
  })

  it("Sending invalid name", (done) => {
    supertest(app)
      .post('/api/task/add_multiple_tasks')
      .set("Authorization", `Bearer ${getData('token')}`)
      .send([{ name: "test1".repeat(50), est: 2 }])
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.name).toBe("For task 1, The name length is more than 50 characters.");

        done();
      })
  })

  it("Sending invalid notes", (done) => {
    supertest(app)
      .post('/api/task/add_multiple_tasks')
      .set("Authorization", `Bearer ${getData('token')}`)
      .send([{ name: "test1", est: 2, notes: "test1".repeat(500) }])
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.notes).toBe("For task 1, The notes length is more than 500 characters.");

        done();
      })
  });

  it("Sending invalid type", (done) => {
    supertest(app)
      .post('/api/task/add_multiple_tasks')
      .set("Authorization", `Bearer ${getData('token')}`)
      .send([{ name: "test1", est: 2, type: { name: "dsfs", code: "kfjds" } }])
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.type).toBe("For task 1, Invalid task type");

        done();
      })
  });

  it("Sending valid data", (done) => {
    supertest(app)
      .post('/api/task/add_multiple_tasks')
      .set("Authorization", `Bearer ${getData('token')}`)
      .send([{ ...taskData[0], check: false }])
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        const data = res.body[0];

        const userId = getData("userId");
        test(data, { userId, check: false, notes: taskData[0].notes, act: 0, est: taskData[0].est, name: taskData[0].name });

        taskData[0] = res.body[0];
        taskData[1] = res.body[1];
        setData("taskData", taskData);

        done();
      })
  });

  it("get all tasks", (done) => {
    const taskData = getData('taskData');
    supertest(app)
      .get("/api/task/")
      .set("Authorization", `Bearer ${getData('token')}`)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        const data = res.body;

        test({ ...data, tasks: data.tasks[1] }, { tasks: taskData[0], total: taskData.length, currentPage: 1, numberOfPages: 1 });

        done();
      })
  });
})
