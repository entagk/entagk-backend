const supertest = require("supertest");
const app = require("../../server");
const { getData, setData, verifyTemplateData } = require("./utils");

module.exports = () => describe("Testing addTemplate controller route /api/template/add/", () => {
  const tempSettings = {
    act: 0,
    color: '',
    time: { PERIOD: 1500, SHORT: 300, LONG: 900 },
    timeForAll: true,
    autoBreaks: false,
    autoPomodors: false,
    autoStartNextTask: false,
    longInterval: 4,
    alarmType: { name: 'alarm 1', src: 'sounds/alarm/1.mp3' },
    tickingType: { name: 'tricking 1', src: 'sounds/tricking/1.mp3' },
    alarmVolume: 50,
    tickingVolume: 50,
    todo: null,
  };

  it("Sending request without sending data ", (done) => {
    supertest(app)
      .post("/api/template/add/")
      .set("Authorization", `Bearer ${getData("token")}`)
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.name).toBe("This field is required");
        expect(res.body.errors.desc).toBe("This field is required");

        done();
      })
  })

  it("Sending request with invalid name", (done) => {
    const templateData = getData("templateData");
    supertest(app)
      .post("/api/template/add/")
      .set("Authorization", `Bearer ${getData("token")}`)
      .send({ ...templateData[0], name: "test".repeat(50) })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.name).toBe("The name length is more than 50 characters.");

        done();
      })
  })

  it("Sending request with invalid description", (done) => {
    const templateData = getData("templateData");
    supertest(app)
      .post("/api/template/add/")
      .set("Authorization", `Bearer ${getData("token")}`)
      .send({ ...templateData[0], desc: "test".repeat(500) })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.desc).toBe("The description length is more than 500 characters.");

        done();
      })
  })

  it("Sending request without tasks", (done) => {
    const templateData = getData("templateData");
    supertest(app)
      .post("/api/template/add/")
      .set("Authorization", `Bearer ${getData("token")}`)
      .send({ ...templateData[0], tasks: [] })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("please enter the template tasks.");

        done();
      })
  });

  it("Sending request with invalid task", (done) => {
    const templateData = getData("templateData");
    supertest(app)
      .post("/api/template/add/")
      .set("Authorization", `Bearer ${getData("token")}`)
      .send({ ...templateData[0], tasks: [{ name: "dkjfs" }] })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.errors.est).toBe("For task 1, This field is required");

        done();
      });
  });

  it("Sending valid template", (done) => {
    const templateData = getData("templateData");
    supertest(app)
      .post("/api/template/add/")
      .set("Authorization", `Bearer ${getData("token")}`)
      .send(templateData[0])
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        verifyTemplateData(res.body, {
          ...templateData[0],
          ...tempSettings
        });

        setData('templateTasks', { tasks: templateData[0].tasks }, getData('templateTasks').length);
        setData('templateData', res.body, 0)

        done();
      });
  });

  it("Sending nonvisible template", (done) => {
    const templateData = getData('templateData');
    supertest(app)
      .post("/api/template/add/")
      .set("Authorization", `Bearer ${getData("token")}`)
      .send(templateData[1])
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        verifyTemplateData(res.body, {
          ...templateData[1],
          ...tempSettings
        });

        setData('templateTasks', { tasks: templateData[0].tasks }, getData('templateTasks').length);
        setData('templateData', res.body, 1)

        done();
      });
  });
});
