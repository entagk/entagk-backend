const supertest = require('supertest');
const app = require('./../server');

module.exports = (url, method, utilsFile) => {
  const { getData } = require(utilsFile);
  it("Sending invalid time", (done) => {
    if (url.includes('template'))
      url = "/api/template/" + getData('templateData')[0]._id;
    supertest(app)
    [method](url)
      .set("Authorization", `Bearer ${getData('token')}`)
      .send({
        time: {
          ["PERIOD"]: -1500,
        }
      })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        console.log(res.body);
        expect(res.body.errors.time)
          .toBe("The time should be at this format {PERIOD: ---, SHORT: ---, LONG: ---} with positive numbers");

        done();
      })
  })

  it("Sending invalid autoBreaks", (done) => {
    supertest(app)
    [method](url)
      .set("Authorization", `Bearer ${getData('token')}`)
      .send({
        autoBreaks: "false"
      })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.autoBreaks)
          .toBe("The property of the autoBreaks is boolean");

        done();
      })
  })

  it("Sending invalid autoPomodors", (done) => {
    supertest(app)
    [method](url)
      .set("Authorization", `Bearer ${getData('token')}`)
      .send({
        autoPomodors: "DSfa"
      })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.autoPomodors)
          .toBe("The property of the autoPomodors is boolean");

        done();
      })
  })

  it("Sending invalid autoStartNextTask", (done) => {
    supertest(app)
    [method](url)
      .set("Authorization", `Bearer ${getData('token')}`)
      .send({
        autoStartNextTask: 54
      })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.autoStartNextTask)
          .toBe("The property of the autoStartNextTask is boolean");

        done();
      })
  })

  it("Sending invalid alarmVolume", (done) => {
    supertest(app)
    [method](url)
      .set("Authorization", `Bearer ${getData('token')}`)
      .send({
        alarmVolume: -55
      })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.alarmVolume)
          .toBe("invalid alarm volume");

        done();
      })
  })

  it("Sending invalid longInterval", (done) => {
    supertest(app)
    [method](url)
      .set("Authorization", `Bearer ${getData('token')}`)
      .send({
        longInterval: -55
      })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.longInterval)
          .toBe("The long interval must be more than 2");

        done();
      })
  })

  it("Sending invalid alarmType", (done) => {
    supertest(app)
    [method](url)
      .set("Authorization", `Bearer ${getData('token')}`)
      .send({
        alarmType: {
          name: "dkjsfajd"
        }
      })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.alarmType)
          .toBe("The sound type should be contines name and src.");

        done();
      })
  })
}
