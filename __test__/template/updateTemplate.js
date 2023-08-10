const path = require('path');
const supertest = require("supertest");
const app = require("../../server");
const { getData, setData } = require("./utils");

const validateTimeAndAudioData = require('./../validateTimeAndAudioData');
const validateAuth = require('../validateAuth');

module.exports = () => describe("Testing update template using PATCH method & route /api/template/:id", () => {
  const utilsPath = path.resolve(__dirname, 'utils.js')

  validateAuth('/api/user/delete_user', 'delete', utilsPath);

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

  const templateData = getData('templateData');
  validateTimeAndAudioData(`/api/template/${templateData[0]._id}`, 'patch', utilsPath);

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
