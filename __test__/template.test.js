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
})