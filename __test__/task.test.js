const app = require("../server");
const mongoose = require("mongoose");
const supertest = require("supertest");
const jwt = require("jsonwebtoken");

const MONGODB_URL = "mongodb://localhost:27017/?authMechanism=DEFAULT";

let userId, token;

beforeAll((done) => {
  mongoose.connect(MONGODB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done());
});

afterAll((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
    console.log("done")
  });
});

describe("Task APIs", () => {
  const userData = { name: "testing123", email: "testing123@test.com", password: "testing123" };
  describe("Testing getAll controller route /api/task/", () => {
    it("Signup before test tasks controller", (done) => {
      supertest(app)
        .post('/api/user/signup') // 'This email is invalid'
        .send(userData)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe('You are logged in successfully');

          userData.token = res.body.token;
          token = res.body.token;
          if (res.body.token.length < 500) {
            const tokenData = jwt.verify(res.body.token, process.env.ACCESS_TOKEN_SECRET);
            expect(mongoose.Types.ObjectId.isValid(tokenData.id)).toBe(true);
            userId = tokenData.id;
          } else {
            const tokenData = jwt.decode(res.body.token);
            expect(mongoose.Types.ObjectId.isValid(tokenData.sub)).toBe(true);
            userId = tokenData.sub;
          }


          done();
        });
    });

    it("get all tasks", (done) => {
      supertest(app)
        .get("/api/task/")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;

          expect(data.tasks).toStrictEqual([]);
          expect(data.total).toBe(0);
          expect(data.currentPage).toBe(0);
          expect(data.numberOfPages).toBe(0);

          done();
        })
    });
  });

  let taskData = [{ name: "test1", est: 2, notes: "test1 test1 test1 test1" }];

  describe("Testing addTask controller route /api/task/add/", () => {
    it("Sending request without sending data", (done) => {
      supertest(app)
        .post('/api/task/add/')
        .set("Authorization", `Bearer ${userData.token}`)
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
        .set("Authorization", `Bearer ${userData.token}`)
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
        .set("Authorization", `Bearer ${userData.token}`)
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
        .set("Authorization", `Bearer ${userData.token}`)
        .send({ name: "test1", est: 2, notes: "test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1" })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("The notes length is more than 50 characters.");

          done();
        })
    })

    it("Sending valid data", (done) => {
      supertest(app)
        .post('/api/task/add/')
        .set("Authorization", `Bearer ${userData.token}`)
        .send(taskData[0])
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;

          expect(mongoose.Types.ObjectId.isValid(data._id)).toBe(true);
          expect(data.name).toBe(taskData[0].name);
          expect(data.est).toBe(taskData[0].est);
          expect(data.act).toBe(0);
          expect(data.notes).toBe(taskData[0].notes);
          expect(data.check).toBe(false);

          taskData[0] = Object.assign(taskData[0], data);

          done();
        })
    })

    it("get all tasks", (done) => {
      supertest(app)
        .get("/api/task/")
        .set("Authorization", `Bearer ${userData.token}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;

          expect(data.tasks[0]).toStrictEqual(taskData[0]);

          expect(data.total).toBe(1);
          expect(data.currentPage).toBe(1);
          expect(data.numberOfPages).toBe(1);

          done();
        })
    });
  });

  describe("Testing updateTask controller route /api/task/update/:id", () => {
    it("Send request with invalid id", (done) => {
      supertest(app)
        .patch(`/api/task/update/dfjdsfkewejriek`)
        .set("Authorization", `Bearer ${userData.token}`)
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
        .set("Authorization", `Bearer ${userData.token}`)
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
        .set("Authorization", `Bearer ${userData.token}`)
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
        .set("Authorization", `Bearer ${userData.token}`)
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
        .set("Authorization", `Bearer ${userData.token}`)
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
        .set("Authorization", `Bearer ${userData.token}`)
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
        .set("Authorization", `Bearer ${userData.token}`)
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
        .set("Authorization", `Bearer ${userData.token}`)
        .send({ ...taskData[0], notes: "test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1" })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("The notes length is more than 50 characters.");

          done();
        })
    })

    it("Sending valid data", (done) => {
      supertest(app)
        .patch(`/api/task/update/${taskData[0]._id}`)
        .set("Authorization", `Bearer ${userData.token}`)
        .send({ ...taskData[0], name: "test2", act: 1 })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;

          expect(data._id).toBe(taskData[0]._id);
          expect(data.name).toBe("test2");
          expect(data.act).toBe(1);
          expect(data.notes).toBe(taskData[0].notes);
          expect(data.project).toBe("");
          expect(data.check).toBe(false);
          expect(data.userId).toBe(userId);
          done();
        })
    })
  });

  describe("Testing deleteTask controller route /api/task/delete/:id", () => {
    it("Send request with invalid id", (done) => {
      supertest(app)
        .delete(`/api/task/delete/dfjdsfkewejriek`)
        .set("Authorization", `Bearer ${userData.token}`)
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
        .set("Authorization", `Bearer ${userData.token}`)
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
        .set("Authorization", `Bearer ${userData.token}`)
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
        .set("Authorization", `Bearer ${userData.token}`)
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
        .set("Authorization", `Bearer ${userData.token}`)
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
        .set("Authorization", `Bearer ${userData.token}`)
        .send(taskData[0])
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;

          expect(mongoose.Types.ObjectId.isValid(data._id)).toBe(true);
          expect(data.name).toBe(taskData[0].name);
          expect(data.est).toBe(taskData[0].est);
          expect(data.act).toBe(0);
          expect(data.notes).toBe(taskData[0].notes);
          expect(data.check).toBe(false);

          taskData[0] = Object.assign(taskData[0], data);

          done();
        })
    })

    it("check task", (done) => {
      supertest(app)
        .post(`/api/task/check/${taskData[0]._id}`)
        .set("Authorization", `Bearer ${userData.token}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;

          expect(data.act).toBe(taskData[0].est);
          expect(data.check).toBe(true);

          done();
        })
    })
  });

  describe("Testing increaseAct controller route /api/task/increase_act/:id", () => {
    it("Send request with invalid id", (done) => {
      supertest(app)
        .post(`/api/task/increase_act/dfjdsfkewejriek`)
        .set("Authorization", `Bearer ${userData.token}`)
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
        .set("Authorization", `Bearer ${userData.token}`)
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
        .set("Authorization", `Bearer ${userData.token}`)
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
        .set("Authorization", `Bearer ${userData.token}`)
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
        .set("Authorization", `Bearer ${userData.token}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;

          expect(data._id).toBe(taskData[0]._id);
          expect(data.name).toBe(taskData[0].name);
          expect(data.act).toBe(1);
          expect(data.notes).toBe(taskData[0].notes);
          expect(data.project).toBe("");
          expect(data.check).toBe(false);
          expect(data.userId).toBe(userId);

          done();
        })
    });
  });

  describe("Testing clearFinished controller route /api/task/clear_finished/", () => {
    it("Add new task data", (done) => {
      supertest(app)
        .post('/api/task/add/')
        .set("Authorization", `Bearer ${userData.token}`)
        .send({ ...taskData[0], est: 5 })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;

          expect(mongoose.Types.ObjectId.isValid(data._id)).toBe(true);
          expect(data.name).toBe(taskData[0].name);
          expect(data.est).toBe(5);
          expect(data.act).toBe(0);
          expect(data.notes).toBe(taskData[0].notes);
          expect(data.check).toBe(false);

          taskData.push(data);

          done();
        })
    })

    it("Add other new task data", (done) => {
      supertest(app)
        .post('/api/task/add/')
        .set("Authorization", `Bearer ${userData.token}`)
        .send({ ...taskData[0], est: 9 })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;

          expect(mongoose.Types.ObjectId.isValid(data._id)).toBe(true);
          expect(data.name).toBe(taskData[0].name);
          expect(data.est).toBe(9);
          expect(data.act).toBe(0);
          expect(data.notes).toBe(taskData[0].notes);
          expect(data.check).toBe(false);

          taskData.push(data);

          done();
        })
    })

    it("check task", (done) => {
      supertest(app)
        .post(`/api/task/check/${taskData[1]._id}`)
        .set("Authorization", `Bearer ${userData.token}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;
          expect(data.act).toBe(taskData[1].est);
          expect(data.check).toBe(true);
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

          expect(res.body.message).toBe("Success deleting.")
          expect(res.body.deletedCount).toBe(taskData.filter((t) => t.check).length);
          taskData = taskData.filter(task => !task?.check);

          done();
        })
    })
  });

  describe("Testing clearAct controller route /api/task/clear_act", () => {
    it("increase act for unchecked task", (done) => {
      supertest(app)
        .patch(`/api/task/update/${taskData[0]._id}`)
        .set("Authorization", `Bearer ${userData.token}`)
        .send({ act: taskData[0].est - 1 })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;

          expect(data._id).toBe(taskData[0]._id);
          expect(data.name).toBe(taskData[0].name);
          expect(data.act).toBe(taskData[0].est - 1);
          expect(data.est).toBe(taskData[0].est);
          expect(data.notes).toBe(taskData[0].notes);
          expect(data.project).toBe("");
          expect(data.check).toBe(false);
          expect(data.userId).toBe(userId);
          taskData[0] = data;

          done();
        })
    });

    it("check task", (done) => {
      supertest(app)
        .post(`/api/task/check/${taskData[1]._id}`)
        .set("Authorization", `Bearer ${userData.token}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;

          expect(data.act).toBe(taskData[1].est);
          expect(data.check).toBe(true);
          taskData[1] = data;

          done();
        })
    });

    it("clear act from tasks", (done) => {
      supertest(app)
        .delete('/api/task/clear_act')
        .set("Authorization", `Bearer ${userData.token}`)
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

          expect(res.body.message).toBe("Successfully deleting.")
          expect(res.body.deletedCount).toBe(taskData.length);

          done();
        })
    })
  });
})