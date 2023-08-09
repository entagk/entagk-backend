const path = require('path');
const supertest = require('supertest');
const app = require('./../../server');
const validateAuth = require('../validateAuth');
const { setData, getData, verifySetting } = require('./utils');

module.exports = () => describe("Testing update setting route /api/setting/ with POST", () => {
  const utilsPath = path.resolve(__dirname, 'utils.js');
  validateAuth('/api/setting/update', 'post', utilsPath);

  it("Sending request Without sending data", (done) => {
    supertest(app)
      .post("/api/setting/update")
      .set("Authorization", `Bearer ${getData('token')}`)
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
      .set("Authorization", `Bearer ${getData('token')}`)
      .send({ format: "kfjdsf" })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.format).toBe("invalid timer format");

        done();
      })
  })

  it("Sending invalid focusMode", (done) => {
    supertest(app)
      .post("/api/setting/update")
      .set("Authorization", `Bearer ${getData('token')}`)
      .send({
        focusMode: "fdksja"
      })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.focusMode)
          .toBe("The property of the focusMode is boolean");

        done();
      })
  });

  it("Sending invalid notificationType", (done) => {
    supertest(app)
      .post("/api/setting/update")
      .set("Authorization", `Bearer ${getData('token')}`)
      .send({
        notificationType: "fdksja"
      })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.notificationType)
          .toBe("Choose the notification type from one of last or every");

        done();
      })
  })

  it("Sending invalid notificationInterval", (done) => {
    supertest(app)
      .post("/api/setting/update")
      .set("Authorization", `Bearer ${getData('token')}`)
      .send({
        notificationInterval: -1
      })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.notificationInterval)
          .toBe("Invalid notification interval between 1 and 60");

        done();
      })
  });

  it("Sending invalid applyTaskSetting", (done) => {
    supertest(app)
      .post('/api/setting/update')
      .set("Authorization", `Bearer ${getData('token')}`)
      .send({
        applyTaskSetting: 'false'
      })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.applyTaskSetting).toBe("The property of the apply task setting is boolean")

        done();
      })
  });

  require('./../validateTimeAndAudioData')("/api/setting/update", 'post', utilsPath);

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
      .set("Authorization", `Bearer ${getData('token')}`)
      .send(data)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        verifySetting(res.body, data)

        done();
      })
  })
})
