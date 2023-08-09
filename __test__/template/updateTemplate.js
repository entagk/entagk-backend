const supertest = require("supertest");
const app = require("../../server");
const { getData, setData } = require("./utils");

module.exports = () => describe("Testing update template using PATCH method & route /api/template/:id", () => {
  it("Sending invalid template id", (done) => {
    supertest(app)
      .patch(`/api/template/dsfdsafasf`)
      .set("Authorization", `Bearer ${getData('token')}`)
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("Invalid id");

        done();
      });
  });

  it("Sending not template id", (done) => {
    const templateData = getData('templateData');
    supertest(app)
      .patch(`/api/template/${templateData[0].tasks[0]}`)
      .set("Authorization", `Bearer ${getData('token')}`)
      .expect(404)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("This template doesn't found.");

        done();
      });
  });

  it("Sending request without data", (done) => {
    const templateData = getData('templateData');
    supertest(app)
      .patch(`/api/template/${templateData[0]._id}`)
      .set("Authorization", `Bearer ${getData('token')}`)
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("Please enter the essential data (eg: name or description) of the template");

        done();
      })
  })

  it("Sending request with invalid name", (done) => {
    const templateData = getData('templateData');
    supertest(app)
      .patch(`/api/template/${templateData[0]._id}`)
      .set("Authorization", `Bearer ${getData('token')}`)
      .send({ ...templateData[0], name: "test1".repeat(50) })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.name).toBe("The name length is more than 50 characters.");

        done();
      })
  })

  it("Sending request with invalid description", (done) => {
    const templateData = getData('templateData');
    supertest(app)
      .patch(`/api/template/${templateData[0]._id}`)
      .set("Authorization", `Bearer ${getData('token')}`)
      .send({ ...templateData[0], desc: "test1".repeat(500) })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.desc).toBe("The description length is more than 500 characters.");

        done();
      })
  })

  it("Sending invalid time", (done) => {
    const templateData = getData('templateData');
    const newTime = { PERIOD: 1500 };
    supertest(app)
      .patch(`/api/template/${templateData[0]._id}`)
      .set("Authorization", `Bearer ${getData('token')}`)
      .send({ time: newTime })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.time).toBe("The time should be at this format {PERIOD: ---, SHORT: ---, LONG: ---} with positive numbers");

        done();
      });
  });

  it("Sending invalid autoBreaks", (done) => {
    const templateData = getData('templateData');
    const autoBreaks = "false";
    supertest(app)
      .patch(`/api/template/${templateData[0]._id}`)
      .set("Authorization", `Bearer ${getData('token')}`)
      .send({ autoBreaks })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.autoBreaks).toBe("The property of the autoBreaks is boolean");

        done();
      });
  });

  it("Sending invalid volume", (done) => {
    const templateData = getData('templateData');
    const alarmVolume = 101;
    supertest(app)
      .patch(`/api/template/${templateData[0]._id}`)
      .set("Authorization", `Bearer ${getData('token')}`)
      .send({ alarmVolume })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.alarmVolume).toBe("invalid alarm volume");

        done();
      });
  });

  it("Sending invalid sound type", (done) => {
    const alarmType = {
      name: "alarm 1"
    };
    const templateData = getData('templateData');
    supertest(app)
      .patch(`/api/template/${templateData[0]._id}`)
      .set("Authorization", `Bearer ${getData('token')}`)
      .send({ alarmType })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.alarmType).toBe("The sound type should be contines name and src.");

        done();
      });
  });

  it("Sending invalid longInterval", (done) => {
    const longInterval = 1;
    const templateData = getData('templateData');
    supertest(app)
      .patch(`/api/template/${templateData[0]._id}`)
      .set("Authorization", `Bearer ${getData('token')}`)
      .send({ longInterval })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.errors.longInterval).toBe("The long interval must be more than 2");

        done();
      });
  });

  it("Update Public template", (done) => {
    const newName = "Template updated 2";
    const templateData = getData('templateData');

    supertest(app)
      .patch(`/api/template/${templateData[0]._id}`)
      .set("Authorization", `Bearer ${getData('token')}`)
      .send({ name: newName })
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        delete templateData[0].updatedAt;
        delete res.body.updatedAt;

        expect(res.body).toEqual({ ...templateData[0], name: newName });

        setData("templateData", templateData[0], 0);

        done();
      });
  });
})
