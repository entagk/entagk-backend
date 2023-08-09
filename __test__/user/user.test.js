const { closeDBConnect, openDBConnect } = require("../helper");

const { initializeData } = require('./utils');

let resetTokenId;

beforeAll((done) => {
  openDBConnect(() => {}, false, done);
});

afterAll((done) => {
  initializeData();
  closeDBConnect(done);
});

describe('User APIs', () => {
  require('./signup')();

  require('./signin')();

  require('./getUser')();

  require('./forgetPassword')();

  require('./verifyResetId')();

  require('./resetPassword')();

  require('./refreshToken')();

  require('./updateUser')();

  // describe("Testing deleteAccount controller route /api/user/delete_user", () => {
  //   it("Delete account successfully", (done) => {
  //     supertest(app)
  //       .delete('/api/user/delete_user')
  //       .set("Authorization", `Bearer ${token}`)
  //       .end((err, res) => {
  //         if (err) throw err;

  //         expect(res.body.message).toBe("Deleted account successfully");
  //         expect(res.body.deleted_id).toBe(userId);

  //         done();
  //       })
  //   })
  // });
})
