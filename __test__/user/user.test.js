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

  // describe("Testing updateUser controller route /api/user/update_user", () => {
  //   it("Sending invalid token", (done) => {
  //     supertest(app)
  //       .patch("/api/user/update_user")
  //       .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MzUzZGNjNzQ2ZTY0OGZhOGNlNzFhZDUiLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE2Njg0NDI5NTkzMTMsImlkIjoiNjM1M2RjYzc0NmU2NDhmYThjZTcxYWQ1In0.kK6Vb9tNrGFmSTuoENsbBdvGpEKkE8PfI5ZPv5lXuUE")
  //       .expect(401)
  //       .end((err, res) => {
  //         if (err) throw err;

  //         expect(res.body.message).toBe("invalid signature");

  //         done();
  //       })
  //   });

  //   it("Sending request without data", (done) => {
  //     supertest(app)
  //       .patch("/api/user/update_user")
  //       .set("Authorization", `Bearer ${token}`)
  //       .expect(400)
  //       .end((err, res) => {
  //         if (err) throw err;

  //         expect(res.body.message).toBe("Please enter the new data");

  //         done();
  //       })
  //   })

  //   it("Sending correct data", (done) => {
  //     const newName = "testing987";
  //     supertest(app)
  //       .patch("/api/user/update_user")
  //       .set("Authorization", `Bearer ${token}`)
  //       .send({ name: newName })
  //       .expect(200)
  //       .end((err, res) => {
  //         if (err) throw err;

  //         expect(res.body.message).toBe("Successfuly updates");
  //         expect(res.body.afterUpdatae.name).toBe(newName);

  //         done();
  //       })
  //   })

  //   it("Reset password using updateUser controller", (done) => {
  //     const newPass = "testing987";
  //     supertest(app)
  //       .patch("/api/user/update_user")
  //       .set("Authorization", `Bearer ${token}`)
  //       .send({ newPassword: newPass, oldPassword: userData.password })
  //       .expect(200)
  //       .end((err, res) => {
  //         if (err) throw err;

  //         expect(res.body.message).toBe("Successfuly updates");
  //         userData.password = newPass;

  //         done();
  //       })
  //   });

  //   it("Login after password reseting", (done) => {
  //     supertest(app)
  //       .post('/api/user/signin')
  //       .send(userData)
  //       .expect(200)
  //       .end((err, res) => {
  //         if (err) throw err;

  //         expect(res.body.message).toBe("You are logged in successfully");

  //         token = res.body.access_token;
  //         if (token.length < 500) {
  //           const tokenData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  //           expect(mongoose.Types.ObjectId.isValid(tokenData.id)).toBe(true);
  //           userId = tokenData.id;
  //         } else {
  //           const tokenData = jwt.decode(token);
  //           expect(mongoose.Types.ObjectId.isValid(tokenData.sub)).toBe(true);
  //           userId = tokenData.sub;
  //         }

  //         done();
  //       })
  //   });

  // });

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
