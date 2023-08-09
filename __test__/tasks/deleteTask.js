const supertest = require('supertest');
const app = require('../../server');

const { getTokenAndUserId, getTaskData } = require('./utils');

const userData = { name: "testing123", email: "testing123@test.com", password: "testing123" };

module.exports = () => describe("Testing deleteTask controller route /api/task/delete/:id", () => {
  it("Send request with invalid id", (done) => {
    supertest(app)
      .delete(`/api/task/delete/dfjdsfkewejriek`)
      .set("Authorization", `Bearer ${getTokenAndUserId().token}`)
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
      .set("Authorization", `Bearer ${getTokenAndUserId().token}`)
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
      .delete(`/api/task/delete/${getTaskData()[0]._id}`)
      .set("Authorization", `Bearer ${getTokenAndUserId().token}`)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        const data = res.body;
        expect(data.message).toBe("Successfully deleted");
        expect(data.deleted_id).toBe(getTaskData()[0]._id);

        done();
      })
  })
});
