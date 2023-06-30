const app = require("../server");
const mongoose = require("mongoose");
const supertest = require("supertest");
const { openDBConnect, closeDBConnect } = require('./helper');
let userId, token;

const userData = { name: "testing123", email: "testing123@test.com", password: "testing123" };
const setData = (t, uId) => {
  token = t;
  userId = uId;
  console.log(token, t);
  console.log(userId, uId);
}

beforeAll((done) => {
  openDBConnect(setData, true, done);
});

afterAll((done) => {
  closeDBConnect(done);
});

const test = (body, data) => {
  const dataEntries = Object.entries(body);

  if (body._id)
    expect(mongoose.Types.ObjectId.isValid(body._id)).toBe(true);

  dataEntries.forEach(([k, v]) => {
    if (data[k])
      expect(body[k]).toStrictEqual(data[k]);
  })
}

describe("Task APIs", () => {
  describe("Testing getAll controller route /api/task/", () => {
    it("get all tasks", (done) => {
      supertest(app)
        .get("/api/task/")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;

          test(data, { tasks: [], total: 0, currentPage: 0, numberOfPages: 0 })

          done();
        })
    });
  });

  let taskData = [{ name: "test1", est: 2, notes: "test1 test1 test1 test1" }];

  describe("Testing addTask controller route /api/task/add/", () => {
    it("Sending request without sending data", (done) => {
      supertest(app)
        .post('/api/task/add/')
        .set("Authorization", `Bearer ${token}`)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("Please, complete the task data at least name and est");

          done();
        })
    })

    it("Sending invalid est", (done) => {
      supertest(app)
        .post('/api/task/add/')
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "test1", est: -1 })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("The est shouldn't be negative number.");

          done();
        })
    })

    it("Sending invalid name", (done) => {
      supertest(app)
        .post('/api/task/add/')
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "test1 test1 test1 test1 test1 test1 test1 test1 test1 test1", est: 2 })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("The name length is more than 50 characters.");

          done();
        })
    })

    it("Sending invalid notes", (done) => {
      supertest(app)
        .post('/api/task/add/')
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "test1", est: 2, notes: "test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1" })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("The notes length is more than 500 characters.");

          done();
        })
    })

    it("Sending valid data", (done) => {
      supertest(app)
        .post('/api/task/add/')
        .set("Authorization", `Bearer ${token}`)
        .send(taskData[0])
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;

          test(data, { userId, check: false, notes: taskData[0].notes, act: 0, est: taskData[0].est, name: taskData[0].name, _id: taskData[0]._id });

          taskData[0] = Object.assign(taskData[0], data);

          done();
        })
    })

    it("get all tasks", (done) => {
      supertest(app)
        .get("/api/task/")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;

          test(data, { tasks: taskData, total: 1, currentPage: 1, numberOfPages: 1 });

          done();
        })
    });
  });

  describe("Testing addMultipleTasks controller throug route /api/task/add_multiple_tasks", () => {
    it("Send request with object data", (done) => {
      supertest(app)
        .post('/api/task/add_multiple_tasks')
        .set("Authorization", `Bearer ${token}`)
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
        .set("Authorization", `Bearer ${token}`)
        .send([])
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("No data have been sent yet.");

          done();
        })
    });

    it("Sending invalid est", (done) => {
      supertest(app)
        .post('/api/task/add_multiple_tasks')
        .set("Authorization", `Bearer ${token}`)
        .send([{ name: "test1", est: -1 }])
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("For task 1, The est shouldn't be negative number.");

          done();
        })
    })

    it("Sending invalid name", (done) => {
      supertest(app)
        .post('/api/task/add_multiple_tasks')
        .set("Authorization", `Bearer ${token}`)
        .send([{ name: "test1 test1 test1 test1 test1 test1 test1 test1 test1 test1", est: 2 }])
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("For task 1, The name length is more than 50 characters.");

          done();
        })
    })

    it("Sending invalid notes", (done) => {
      supertest(app)
        .post('/api/task/add_multiple_tasks')
        .set("Authorization", `Bearer ${token}`)
        .send([{ name: "test1", est: 2, notes: "test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1" }])
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("For task 1, The notes length is more than 500 characters.");

          done();
        })
    })

    it("Sending valid data", (done) => {
      supertest(app)
        .post('/api/task/add_multiple_tasks')
        .set("Authorization", `Bearer ${token}`)
        .send([{ ...taskData[0], check: false }])
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body[0];

          test(data, { userId, check: false, notes: taskData[0].notes, act: 0, est: taskData[0].est, name: taskData[0].name });

          taskData[1] = Object.assign(taskData[0], data);

          done();
        })
    })

    it("get all tasks", (done) => {
      supertest(app)
        .get("/api/task/")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;

          test({ ...data, tasks: data.tasks[1] }, { tasks: taskData[1], total: taskData.length, currentPage: 1, numberOfPages: 1 });

          done();
        })
    });
  })

  describe("Testing updateTask controller route /api/task/update/:id", () => {
    it("Send request with invalid id", (done) => {
      supertest(app)
        .patch(`/api/task/update/dfjdsfkewejriek`)
        .set("Authorization", `Bearer ${token}`)
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
        .set("Authorization", `Bearer ${token}`)
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
        .patch(`/api/task/update/${taskData[0]._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("Please enter the data that you want to update the task to it.");

          done();
        })
    })

    it("Send invalid est", (done) => {
      supertest(app)
        .patch(`/api/task/update/${taskData[0]._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ ...userData, est: -1 })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("The est shouldn't be negative number.");

          done();
        })
    })

    it("Send invalid act", (done) => {
      supertest(app)
        .patch(`/api/task/update/${taskData[0]._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ ...userData, act: -1 })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("The act shouldn't be negative number.");

          done();
        })
    })

    it("Send act more than est", (done) => {
      supertest(app)
        .patch(`/api/task/update/${taskData[0]._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ ...userData, act: 3 })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("The act shouldn't be more than est.");

          done();
        })
    })

    it("Sending invalid name", (done) => {
      supertest(app)
        .patch(`/api/task/update/${taskData[0]._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ ...taskData[0], name: "test1 test1 test1 test1 test1 test1 test1 test1 test1 test1" })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("The name length is more than 50 characters.");

          done();
        })
    })

    it("Sending invalid notes", (done) => {
      supertest(app)
        .patch(`/api/task/update/${taskData[0]._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ ...taskData[0], notes: "test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1" })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("The notes length is more than 500 characters.");

          done();
        })
    })

    it("Sending valid data", (done) => {
      supertest(app)
        .patch(`/api/task/update/${taskData[0]._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ ...taskData[0], name: "test2", act: 1 })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;

          test(data, { userId, check: false, notes: taskData[0].notes, act: 1, est: taskData[0].est, name: "test2", _id: taskData[0]._id });

          done();
        })
    })
  });

  describe("Testing deleteTask controller route /api/task/delete/:id", () => {
    it("Send request with invalid id", (done) => {
      supertest(app)
        .delete(`/api/task/delete/dfjdsfkewejriek`)
        .set("Authorization", `Bearer ${token}`)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("Invalid id");

          done();
        })
    })

    it('Send id for not found task', (done) => {
      supertest(app)
        .delete(`/api/task/delete/637433baec806fe7624d1447`)
        .set("Authorization", `Bearer ${token}`)
        .send({ ...userData, est: 5 })
        .expect(404)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("This task doesn't found.");

          done();
        })
    })

    it("delete task", (done) => {
      supertest(app)
        .delete(`/api/task/delete/${taskData[0]._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;
          expect(data.message).toBe("Successfully deleted");
          expect(data.deleted_id).toBe(taskData[0]._id);

          done();
        })
    })
  });

  describe("Testing checkTask controller route /api/task/check/:id", () => {
    it("Send request with invalid id", (done) => {
      supertest(app)
        .post(`/api/task/check/dfjdsfkewejriek`)
        .set("Authorization", `Bearer ${token}`)
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
        .set("Authorization", `Bearer ${token}`)
        .send({ ...userData, est: 5 })
        .expect(404)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("This task doesn't found.");

          done();
        })
    })

    it("Add new task", (done) => {
      supertest(app)
        .post('/api/task/add/')
        .set("Authorization", `Bearer ${token}`)
        .send(taskData[0])
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;

          test(data, { userId, check: false, notes: taskData[0].notes, act: 0, est: taskData[0].est, name: taskData[0].name });

          taskData[0] = Object.assign(taskData[0], data);

          done();
        })
    })

    it("check task", (done) => {
      supertest(app)
        .post(`/api/task/check/${taskData[0]._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;

          test(data, { act: taskData[0].est, check: true });

          done();
        })
    })
  });

  // fix these
  describe("Testing increaseAct controller route /api/task/increase_act/:id", () => {
    it("Send request with invalid id", (done) => {
      supertest(app)
        .post(`/api/task/increase_act/dfjdsfkewejriek`)
        .set("Authorization", `Bearer ${token}`)
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
        .set("Authorization", `Bearer ${token}`)
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
        .post(`/api/task/increase_act/${taskData[0]._id}`)
        .set("Authorization", `Bearer ${token}`)
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
        .post(`/api/task/check/${taskData[0]._id}`)
        .set("Authorization", `Bearer ${token}`)
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
      supertest(app)
        .post(`/api/task/increase_act/${taskData[0]._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;

          test(data, { userId, check: false, project: "", notes: taskData[0].notes, act: 1, name: taskData[0].name, _id: taskData[0]._id });

          done();
        })
    });
  });

  describe("Testing clearFinished controller route /api/task/clear_finished/", () => {
    it("Add new task data", (done) => {
      supertest(app)
        .post('/api/task/add/')
        .set("Authorization", `Bearer ${token}`)
        .send({ ...taskData[0], est: 5 })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;

          test(data, { userId, check: false, notes: taskData[0].notes, act: 0, est: 5, name: taskData[0].name });

          taskData.push(data);

          done();
        })
    })

    it("Add other new task data", (done) => {
      supertest(app)
        .post('/api/task/add/')
        .set("Authorization", `Bearer ${token}`)
        .send({ ...taskData[0], est: 9 })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;

          test(data, { userId, check: false, notes: taskData[0].notes, act: 0, est: 9, name: taskData[0].name });

          taskData.push(data);

          done();
        })
    })

    it("check task", (done) => {
      supertest(app)
        .post(`/api/task/check/${taskData[1]._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;

          test(data, { check: true, act: taskData[1].est });

          taskData[1] = data;

          done();
        })
    })

    it("clear finished tasks", (done) => {
      supertest(app)
        .delete('/api/task/clear_finished/')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("Success deleted.")
          expect(res.body.deletedCount).toBe(taskData.filter((t) => t.check).length);
          taskData = taskData.filter(task => !task?.check);

          done();
        })
    })
  });

  describe("Testing clearAct controller route /api/task/clear_act", () => {
    it("increase act for unchecked task", (done) => {
      supertest(app)
        .patch(`/api/task/update/${taskData[1]._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ act: taskData[1].est - 1 })
        // .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;

          test(data, { userId, check: false, notes: taskData[0].notes, act: taskData[1].est - 1, est: taskData[1].est, name: taskData[1].name, _id: taskData[1]._id });
          taskData[1] = data;

          done();
        })
    });

    it("check task", (done) => {
      supertest(app)
        .post(`/api/task/check/${taskData[1]._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;

          test(data, { userId, check: true, notes: taskData[0].notes, act: taskData[1].est, est: taskData[1].est, name: taskData[1].name, _id: taskData[1]._id });

          taskData[1] = data;

          done();
        })
    });

    it("clear act from tasks", (done) => {
      supertest(app)
        .delete('/api/task/clear_act')
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("Successful update.");
          expect(res.body.modifiedCount).toBe(taskData.filter(task => task.act > 0).length)

          done();
        })
    })
  });

  describe('Testing clearAll controller route /api/task/clear_all', () => {
    it("clear finished tasks", (done) => {
      supertest(app)
        .delete('/api/task/clear_all/')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("Successfully deleted.")
          expect(res.body.deletedCount).toBe(taskData.length);

          done();
        })
    })
  });
})
