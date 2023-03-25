const supertest = require("supertest");
const app = require("../server");
const { closeDBConnect, openDBConnect } = require('./helper');

let userId, token;

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

const verifySetting = (body, data) => {
  Object.entries(body).forEach(([k, v]) => {
    if (k in data) {
      expect(body[k]).toStrictEqual(data[k]);
    }
  })
}

describe("Timer Setting API", () => {
  let settingData;
  describe("Testing getSetting controller route /api/setting/ with GET", () => {
    console.log(token);
    it("Getting setting succesfully", (done) => {
      supertest(app)
        .get("/api/setting/")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          settingData = res.body;
          verifySetting(settingData, {
            format: "analog",
            time: {
              ["PERIOD"]: 1500,
              ["SHORT"]: 300,
              ["LONG"]: 900,
            },
            autoBreaks: false,
            autoPomodors: false,
            autoStartNextTask: false,
            longInterval: 4,
            alarmType: {
              name: "alarm 1",
              src: 'sounds/alarm/1.mp3'
            },
            alarmVolume: 50,
            alarmRepet: 0,
            tickingType: {
              name: "tricking 1",
              src: "sounds/tricking/1.mp3"
            },
            tickingVolume: 50,
            clickType: {
              name: "can opening pop",
              src: "sounds/click/can-opening-pop-101856.mp3"
            },
            clickVolume: 50,
            focusMode: false,
            notificationType: "last",
            notificationInterval: 5,
            userId: userId,
          })

          done();
        })
    })
  })

  describe("Testing update setting route /api/setting/ with POST", () => {
    it("Sending request Without sending data", (done) => {
      supertest(app)
        .post("/api/setting/update")
        .set("Authorization", `Bearer ${token}`)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("No valid data sended");

          done();
        })
    })

    it("Sending invalid timer format", (done) => {
      supertest(app)
        .post("/api/setting/update")
        .set("Authorization", `Bearer ${token}`)
        .send({ format: "kfjdsf" })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("invalid timer format");

          done();
        })
    })

    it("Sending invalid time", (done) => {
      supertest(app)
        .post("/api/setting/update")
        .set("Authorization", `Bearer ${token}`)
        .send({
          time: {
            ["PERIOD"]: -1500,
          }
        })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message)
            .toBe("The time should be at this format {PERIOD: ---, SHORT: ---, LONG: ---} with positive numbers");

          done();
        })
    })

    it("Sending invalid autoBreaks", (done) => {
      supertest(app)
        .post("/api/setting/update")
        .set("Authorization", `Bearer ${token}`)
        .send({
          autoBreaks: "false"
        })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message)
            .toBe("The property of the autoBreaks is boolean");

          done();
        })
    })

    it("Sending invalid autoPomodors", (done) => {
      supertest(app)
        .post("/api/setting/update")
        .set("Authorization", `Bearer ${token}`)
        .send({
          autoPomodors: "DSfa"
        })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message)
            .toBe("The property of the autoPomodors is boolean");

          done();
        })
    })

    it("Sending invalid autoStartNextTask", (done) => {
      supertest(app)
        .post("/api/setting/update")
        .set("Authorization", `Bearer ${token}`)
        .send({
          autoStartNextTask: 54
        })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message)
            .toBe("The property of the autoStartNextTask is boolean");

          done();
        })
    })

    it("Sending invalid alarmVolume", (done) => {
      supertest(app)
        .post("/api/setting/update")
        .set("Authorization", `Bearer ${token}`)
        .send({
          alarmVolume: -55
        })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message)
            .toBe("invalid sound volume");

          done();
        })
    })

    it("Sending invalid longInterval", (done) => {
      supertest(app)
        .post("/api/setting/update")
        .set("Authorization", `Bearer ${token}`)
        .send({
          longInterval: -55
        })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message)
            .toBe("The long interval must be more than 2");

          done();
        })
    })

    it("Sending invalid alarmType", (done) => {
      supertest(app)
        .post("/api/setting/update")
        .set("Authorization", `Bearer ${token}`)
        .send({
          alarmType: {
            name: "dkjsfajd"
          }
        })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message)
            .toBe("The sound type should be contines name and src.");

          done();
        })
    })

    it("Sending invalid focusMode", (done) => {
      supertest(app)
        .post("/api/setting/update")
        .set("Authorization", `Bearer ${token}`)
        .send({
          focusMode: "fdksja"
        })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message)
            .toBe("The property of the focusMode is boolean");

          done();
        })
    })

    it("Sending invalid notificationType", (done) => {
      supertest(app)
        .post("/api/setting/update")
        .set("Authorization", `Bearer ${token}`)
        .send({
          notificationType: "fdksja"
        })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message)
            .toBe("Choose the notification type from one of last or every");

          done();
        })
    })

    it("Sending invalid notificationInterval", (done) => {
      supertest(app)
        .post("/api/setting/update")
        .set("Authorization", `Bearer ${token}`)
        .send({
          notificationInterval: -1
        })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message)
            .toBe("Invalid notification interval between 1 and 60");

          done();
        })
    })

    const data = {
      format: "digital",
      time: { PERIOD: 21, SHORT: 1, LONG: 10 },
      alarmVolume: 0,
      tickingVolume: 1,
      clickVolume: 0,
    };

    it("Sending valid data", (done) => {
      supertest(app)
        .post("/api/setting/update")
        .set("Authorization", `Bearer ${token}`)
        .send(data)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          verifySetting(res.body, data)

          done();
        })
    })

  })
})
