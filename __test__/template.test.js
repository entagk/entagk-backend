const supertest = require("supertest");
const app = require("../server");
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");

const MONGODB_URL = "mongodb://localhost:27017/?authMechanism=DEFAULT";

let userId, token;

beforeAll((done) => {
  mongoose.connect(MONGODB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done());
});

/**
 * Before start in testing: Sign up the user and get the token for authorization for every test.
 */
beforeAll(async () => {
  const userData = { name: "testing123", email: "testing123@test.com", password: "testing123" };

  const res = await supertest(app).post('/api/user/signup').send(userData)

  token = res.body.token;

  if (res.body.token?.length < 500) {
    const tokenData = jwt.verify(res.body.token, process.env.ACCESS_TOKEN_SECRET);
    expect(mongoose.Types.ObjectId.isValid(tokenData.id)).toBe(true);
    userId = tokenData?.id;
  } else {
    const tokenData = jwt.decode(res.body.token);
    expect(mongoose.Types.ObjectId.isValid(tokenData.sub)).toBe(true);
    userId = tokenData?.sub;
  }
})

afterAll((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
    console.log("done")
  });
});

describe("Template APIs", () => {
  const userData = { name: "testing123", email: "testing123@test.com", password: "testing123" };

  let templateData = [
    {
      "name": "Template 1",
      "desc": "This is the Other Template",
      "tasks": [
        {
          "name": "template task 1",
          "est": 5
        },
        {
          "name": "template task 2",
          "est": 10
        }
      ],
      "visibility": true
    },
    {
      "name": "Template 2",
      "desc": "This is the Other Template",
      "tasks": [
        {
          "name": "template task 1",
          "est": 5
        },
        {
          "name": "template task 2",
          "est": 10
        }
      ],
      "visibility": false
    }
  ];
  const templateTasks = [];

  const todoTemplate = [];

  describe("Testing addTemplate controller route /api/template/add/", () => {
    it("Sending request without sending data ", (done) => {
      supertest(app)
        .post("/api/template/add/")
        .set("Authorization", `Bearer ${token}`)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("Please enter the essential data (eg: name or description) of the template");

          done();
        })
    })

    it("Sending request with invalid name", (done) => {
      supertest(app)
        .post("/api/template/add/")
        .set("Authorization", `Bearer ${token}`)
        .send({ ...templateData[0], name: "The name length is more than 50 characters. The name length is more than 50 characters." })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("The name length is more than 50 characters.");

          done();
        })
    })

    it("Sending request with invalid description", (done) => {
      supertest(app)
        .post("/api/template/add/")
        .set("Authorization", `Bearer ${token}`)
        .send({ ...templateData[0], desc: "The description length is more than 500 characters. The description length is more than 500 characters. The description length is more than 500 characters. The description length is more than 500 characters. The description length is more than 500 characters. The description length is more than 500 characters. The description length is more than 500 characters. The description length is more than 500 characters. The description length is more than 500 characters. The description length is more than 500 characters." })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("The description length is more than 500 characters.");

          done();
        })
    })

    it("Sending request without tasks", (done) => {
      supertest(app)
        .post("/api/template/add/")
        .set("Authorization", `Bearer ${token}`)
        .send({ ...templateData[0], tasks: [] })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("please enter the template tasks.");

          done();
        })
    });

    it("Sending request with invalid task", (done) => {
      supertest(app)
        .post("/api/template/add/")
        .set("Authorization", `Bearer ${token}`)
        .send({ ...templateData[0], tasks: [{ name: "dkjfs" }] })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.message).toBe("Please, complete the task data at least name and est");

          done();
        });
    });

    it("Sending valid template", (done) => {
      supertest(app)
        .post("/api/template/add/")
        .set("Authorization", `Bearer ${token}`)
        .send(templateData[0])
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.name).toBe(templateData[0].name);
          expect(res.body.description).toBe(templateData[0].desc);
          expect(res.body.description).toBe(templateData[0].desc);
          expect(res.body.visibility).toBe(templateData[0].visibility);
          expect(res.body.tasks.length).toEqual(templateData[0].tasks.length);
          expect(res.body.est).toEqual(templateData[0].tasks.reduce((total, { est }) => est + total, 0));
          expect(res.body.act).toEqual(0);
          expect(res.body.color).toEqual('#ef9b0f');
          expect(res.body.time).toEqual({ PERIOD: 1500, SHORT: 300, LONG: 900 });
          expect(res.body.timeForAll).toBe(true);
          expect(res.body.autoBreaks).toBe(false);
          expect(res.body.autoPomodors).toBe(false);
          expect(res.body.autoStartNextTask).toBe(false);
          expect(res.body.longInterval).toBe(4);
          expect(res.body.alarmType).toEqual({ name: 'alarm 1', src: 'sounds/alarm/1.mp3' });
          expect(res.body.tickingType).toEqual({ name: 'tricking 1', src: 'sounds/tricking/1.mp3' });
          expect(res.body.alarmVolume).toBe(50);
          expect(res.body.tickingVolume).toBe(50);
          expect(res.body.todo).toBe(null);

          templateTasks.push({ tasks: templateData[0].tasks });
          templateData[0] = res.body;

          done();
        })
    })

    it("Sending nonvisible template", (done) => {
      supertest(app)
        .post("/api/template/add/")
        .set("Authorization", `Bearer ${token}`)
        .send(templateData[1])
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.name).toBe(templateData[1].name);
          expect(res.body.description).toBe(templateData[1].desc);
          expect(res.body.description).toBe(templateData[1].desc);
          expect(res.body.visibility).toBe(templateData[1].visibility);
          expect(res.body.tasks.length).toEqual(templateData[1].tasks.length);
          expect(res.body.est).toEqual(templateData[1].tasks.reduce((total, { est }) => est + total, 0));
          expect(res.body.act).toEqual(0);
          expect(res.body.color).toEqual('#ef9b0f');
          expect(res.body.time).toEqual({ PERIOD: 1500, SHORT: 300, LONG: 900 });
          expect(res.body.timeForAll).toBe(true);
          expect(res.body.autoBreaks).toBe(false);
          expect(res.body.autoPomodors).toBe(false);
          expect(res.body.autoStartNextTask).toBe(false);
          expect(res.body.longInterval).toBe(4);
          expect(res.body.alarmType).toEqual({ name: 'alarm 1', src: 'sounds/alarm/1.mp3' });
          expect(res.body.tickingType).toEqual({ name: 'tricking 1', src: 'sounds/tricking/1.mp3' });
          expect(res.body.alarmVolume).toBe(50);
          expect(res.body.tickingVolume).toBe(50);
          expect(res.body.todo).toBe(null);

          templateTasks.push({ tasks: templateData[1].tasks });
          templateData[1] = res.body;

          done();
        })
    })
  });

  describe("Testing getAll controller for route /api/template/", () => {
    it("Sending vaild getAll request", (done) => {
      supertest(app)
        .get("/api/template/")
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.templates).toEqual([{ ...templateData[0] }]);
          expect(res.body.total).toBe(1);
          expect(res.body.currentPage).toBe(1);
          expect(res.body.numberOfPages).toBe(1);

          done();
        })
    })
  })

  describe("Testing getOne controller", () => {
    it("get public template", (done) => {
      supertest(app)
        .get(`/api/template/one/${templateData[0]._id}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body).toEqual(templateData[0]);

          done();
        });
    });

    it("get private template", (done) => {
      supertest(app)
        .get(`/api/template/one/private/${templateData[1]._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body).toEqual(templateData[1]);

          done();
        });
    });

    it("send invalid id using route /api/template/one/privite/djs21dsf", (done) => {
      supertest(app)
        .get(`/api/template/one/private/djs21dsf`)
        .set("Authorization", `Bearer ${token}`)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("Invalid id");

          done();
        });
    });

    it("send not found template id using route /api/template/one/privite/63e0180ebb43b174201482a0", (done) => {
      supertest(app)
        .get(`/api/template/one/private/63e0180ebb43b174201482a0`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("This template doesn't found.");

          done();
        });
    });

    it("get private template using route /api/template/one/63e0180ebb43b174201482a0", (done) => {
      supertest(app)
        .get(`/api/template/one/${templateData[1]._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(405)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("Not allow for you.");

          done();
        });
    });
  });

  describe("Testing getting template tasks controller", () => {
    it("get tasks from public template", (done) => {
      supertest(app)
        .get(`/api/template/one/tasks/${templateData[0]._id}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body[0]._id).toBe(templateData[0].tasks[0]);
          expect(res.body[1]._id).toBe(templateData[0].tasks[1]);

          expect(res.body[0].name).toBe(templateTasks[0].tasks[0].name);
          expect(res.body[1].name).toBe(templateTasks[0].tasks[1].name);

          expect(res.body[0].est).toBe(templateTasks[0].tasks[0].est);
          expect(res.body[1].est).toBe(templateTasks[0].tasks[1].est);

          expect(res.body[0].template._id).toBe(templateData[0]._id);
          expect(res.body[1].template._id).toBe(templateData[0]._id);

          expect(res.body[0].template.todo).toBe(false);
          expect(res.body[1].template.todo).toBe(false);

          expect(res.body[0].userId).toBe(userId);
          expect(res.body[1].userId).toBe(userId);

          done();
        });
    });

    it("get tasks from private template", (done) => {
      supertest(app)
        .get(`/api/template/one/tasks/private/${templateData[1]._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body[0]._id).toBe(templateData[1].tasks[0]);
          expect(res.body[1]._id).toBe(templateData[1].tasks[1]);

          expect(res.body[0].name).toBe(templateTasks[1].tasks[0].name);
          expect(res.body[1].name).toBe(templateTasks[1].tasks[1].name);

          expect(res.body[0].est).toBe(templateTasks[1].tasks[0].est);
          expect(res.body[1].est).toBe(templateTasks[1].tasks[1].est);

          expect(res.body[0].template._id).toBe(templateData[1]._id);
          expect(res.body[1].template._id).toBe(templateData[1]._id);

          expect(res.body[0].template.todo).toBe(false);
          expect(res.body[1].template.todo).toBe(false);

          expect(res.body[0].userId).toBe(userId);
          expect(res.body[1].userId).toBe(userId);

          done();
        });
    });

    it("send invalid id using route /api/template/one/tasks/privite/djs21dsf", (done) => {
      supertest(app)
        .get(`/api/template/one/tasks/private/djs21dsf`)
        .set("Authorization", `Bearer ${token}`)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("Invalid id");

          done();
        });
    });

    it("send not found template id using route /api/template/one/tasks/privite/63e0180ebb43b174201482a0", (done) => {
      supertest(app)
        .get(`/api/template/one/tasks/private/63e0180ebb43b174201482a0`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("This template doesn't found.");

          done();
        });
    });

    it("get tasks from private template using route /api/template/one/tasks/63e0180ebb43b174201482a0", (done) => {
      supertest(app)
        .get(`/api/template/one/tasks/${templateData[1]._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(405)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("Not allow for you.");

          done();
        });
    });
  });

  describe("Testing getting user templates using route /api/template/user/", () => {
    it("Send request without token", (done) => {
      supertest(app)
        .get("/api/template/user")
        .expect(401)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("Invalid Authentication.");

          done();
        })
    });

    it("Send request with invalid token", (done) => {
      supertest(app)
        .get("/api/template/user")
        .set("Authorization", `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QwMTIzQGV4YW1wbGUuY29tIiwiaWQiOiI2MzhjMTE2NDI1ZGI3OGI1MGJjYzFjMDgiLCJpYXQiOjE2NzEwMzE5NzMsImV4cCI6MTY3MTA4OTU3M30.6lafCmgJDX393gGNakvwPbprgCHvrvVIXxUC3wSmxMg`)
        .expect(401)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("Invalid Authentication and jwt expired");

          done();
        })
    });

    it("Valid User", (done) => {
      supertest(app)
        .get("/api/template/user")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.total).toBe(templateData.length);
          expect(res.body.currentPage).toBe(res.body.total === 0 ? 0 : 1);
          expect(res.body.numberOfPages).toBe(Math.ceil(res.body.total / 25));

          expect(res.body.templates).toEqual(templateData);

          done();
        })
    });
  });

  describe("Testing add template to todo list using route /api/template/toto/:id", () => {
    it("Sending valid template id", (done) => {
      const order = 0;
      supertest(app)
        .post(`/api/template/todo/${templateData[0]._id}`)
        .send({ order: order })
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.name).toBe(templateData[0].name);
          expect(res.body.visibility).toBe(false);
          expect(res.body.desc).toBe(templateData[0].desc);
          expect(res.body.userId).toBe(templateData[0].userId);
          expect(res.body.est).toBe(templateData[0].est);
          expect(res.body.act).toBe(0);
          expect(res.body.time).toEqual(templateData[0].time);
          expect(res.body.timeForAll).toBe(templateData[0].timeForAll);
          expect(res.body.autoBreaks).toBe(templateData[0].autoBreaks);
          expect(res.body.autoPomodors).toBe(templateData[0].autoPomodors);
          expect(res.body.autoAutoStartNextTask).toBe(templateData[0].autoAutoStartNextTask);
          expect(res.body.longInterval).toBe(templateData[0].longInterval);
          expect(res.body.alarmType).toEqual(templateData[0].alarmType);
          expect(res.body.alarmVolume).toBe(templateData[0].alarmVolume);
          expect(res.body.alarmRepet).toBe(templateData[0].alarmRepet);
          expect(res.body.tickingType).toEqual(templateData[0].tickingType);
          expect(res.body.tickingVolume).toBe(templateData[0].tickingVolume);
          expect(res.body.todo.userId).toBe(userId);
          expect(res.body.todo.order).toBe(order);

          todoTemplate.push(res.body);

          done();
        })
    });

    it("Sending invalid template id", (done) => {
      supertest(app)
        .post(`/api/template/todo/dsfdsafasf`)
        .set("Authorization", `Bearer ${token}`)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("Invalid id");

          done();
        });
    });

    it("Sending not template id", (done) => {
      console.log(templateData[0].tasks)
      supertest(app)
        .post(`/api/template/todo/${templateData[0].tasks[0]}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("This template doesn't found.");

          done();
        });
    })
  });
})