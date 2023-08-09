const supertest = require('supertest');
const app = require('../../server');

const { getData } = require("./utils");
const validateAuth = require('./validateAuth');

module.exports = () => describe("Testing deleteUser controller route /api/user/delete_user", () => {
  validateAuth('/api/user/delete_user', 'delete');

  it("Delete account successfully", (done) => {
    supertest(app)
      .delete('/api/user/delete_user')
      .set("Authorization", `Bearer ${getData("token")}`)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        console.log(res.body);

        expect(res.body.message).toBe("Deleted account successfully");
        expect(res.body.deleted_id).toBe(userId);

        done();
      })
  })
});
