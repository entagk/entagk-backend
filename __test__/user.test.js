const app = require('../server');
const mongoose = require('mongoose');
const supertest = require('supertest');
const jwt = require('jsonwebtoken');
const {closeDBConnect, openDBConnect} = require("./helper");

let userId, token, resetTokenId;

beforeAll((done) => {
  openDBConnect(() => {}, false, done);
});

afterAll((done) => {
  closeDBConnect(done);
});

describe('User APIs', () => {
  const userData = { name: "testing123", email: "testing123@test.com", password: "testing123" }
  describe('testing Signup POST through route /api/user/signup', () => {
    it("Testing sending invalid data and it should return error message and statusCode is 400", (done) => {
      supertest(app)
        .post('/api/user/signup')
        .send({ name: userData.name, email: userData.email })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("Please enter all data fields");
          done();
        })
    });

    it("Testing sending invalid email and it should return error message and statusCode is 400", (done) => {
      supertest(app)
        .post('/api/user/signup') // 'This email is invalid'
        .send({ ...userData, email: "testing123" })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe('This email is invalid');
          done();
        })
    });

    it("Testing sending invalid password and it should return error message and statusCode is 400", (done) => {
      supertest(app)
        .post('/api/user/signup')
        .send({ ...userData, password: "test" })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe('The password must be at least 8 letters and numbers');
          done();
        });
    });

    it("Testing sending data and it should return success message and token", (done) => {
      supertest(app)
        .post('/api/user/signup') // 'This email is invalid'
        .send(userData)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe('You are logged in successfully');

          token = res.body.access_token;
          if (res.body.access_token.length < 500) {
            const tokenData = jwt.verify(res.body.access_token, process.env.ACCESS_TOKEN_SECRET);
            expect(mongoose.Types.ObjectId.isValid(tokenData.id)).toBe(true);
            userId = tokenData.id;
          } else {
            const tokenData = jwt.decode(res.body.access_token);
            expect(mongoose.Types.ObjectId.isValid(tokenData.sub)).toBe(true);
            userId = tokenData.sub;
          }


          done();
        });
    });

    it("Testing sending old user data and it should return error message with statusCode 400", (done) => {
      supertest(app)
        .post('/api/user/signup') // 'This email is invalid'
        .send({ ...userData })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe('This email already exists');

          done();
        });
    });
  });

  describe("testing Signin POST through route /api/user/signin", () => {
    const notFoundUser = { password: 'kdsfjkjske', email: "kdsfjkjske@test.com" };
    it("Testing sending not found user data and it should return error message and statusCode is 400", (done) => {
      // jest.setTimeout(10000)
      supertest(app)
        .post('/api/user/signin')
        .send({ ...notFoundUser })
        .expect(404)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("user not found");
          done();
        })
    });

    it("Testing sending invalid user data that will return error data", (done) => {
      supertest(app)
        .post('/api/user/signin')
        .send({ ...userData, password: 'ksjfkds' })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("wrong password");

          done();
        })
    });

    it("Testing sending valid user data that will return success message and access token", (done) => {
      supertest(app)
        .post('/api/user/signin')
        .send(userData)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("You are logged in successfully");

          token = res.body.access_token;
          if (res.body.access_token.length < 500) {
            const tokenData = jwt.verify(res.body.access_token, process.env.ACCESS_TOKEN_SECRET);
            expect(mongoose.Types.ObjectId.isValid(tokenData.id)).toBe(true);
            userId = tokenData.id;
          } else {
            const tokenData = jwt.decode(res.body.access_token);
            expect(mongoose.Types.ObjectId.isValid(tokenData.sub)).toBe(true);
            userId = tokenData.sub;
          }

          done();
        })
    });
  });

  describe("Testing GetUser GET through route /api/user/user_info", () => {
    it("Testing sending request without token", (done) => {
      supertest(app)
        .get('/api/user/user_info')
        .expect(401)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("Invalid Authentication.");
          done();
        })
    });

    it("Testing sending request with token", (done) => {
      supertest(app)
        .get('/api/user/user_info')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;
          expect(mongoose.Types.ObjectId.isValid(data._id)).toBe(true);
          expect(data.name).toBe(userData.name);
          expect(data.email).toBe(userData.email);

          done();
        })
    });
  });

  describe("Testing forgotPassword POST through route /api/user/forgot_password", () => {
    // PASS
    it("Testing forgotPassword controller and return success message", (done) => {
      supertest(app)
        .post('/api/user/forgot_password')
        .send({ email: userData.email })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("checkout your email.");
          expect(res.body.result.accepted[0]).toBe(userData.email);

          resetTokenId = res.body.result.ResetId;

          done();
        })
    })

    // PASS
    it("Testing forgotPassword controller with invalid email and then return error message", (done) => {
      supertest(app)
        .post('/api/user/forgot_password')
        .send({ email: "kjdsafk" })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.message).toBe('This email is invalid');
          done();
        })
    })

    // PASS
    it("Testing forgotPassword controller with not founded email and then return error message", (done) => {
      supertest(app)
        .post('/api/user/forgot_password')
        .send({ email: "kjdsafk@fkjd.come" })
        .expect(404)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("This email is not found");

          done();
        })
    })
  });

  describe("Testing verifyResetId POST through route /api/user/verify_reset_id", () => {
    // PASS
    it("Testing controller with successful message", (done) => {
      supertest(app)
        .post('/api/user/verify_reset_id')
        .set('Authorization', `Bearer ${resetTokenId}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.verify).toBe(true);
          expect(res.body.message).toBe("Founded user.");

          done();
        })
    })

    // PASS
    it("Testing controller with invalid resetTokenId", (done) => {
      supertest(app)
        .post('/api/user/verify_reset_id')
        .set('Authorization', `Bearer SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`)
        .expect(404)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe('Expired token, please try set password again.');

          done();
        })
    })

    // PASS
    it("Testing controller without resetTokenId", (done) => {
      supertest(app)
        .post('/api/user/verify_reset_id')
        .expect(401)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("Invalid Authentication.");

          done();
        })
    });
  });

  describe("Testing resetPassword POST route /api/user/reset_password", () => {

    it("without sending password", (done) => {
      supertest(app)
        .post('/api/user/reset_password')
        .set('Authorization', `Bearer ${resetTokenId}`)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("Please, enter a valid new password.");

          done();
        })
    })

    it("sending invalid password", (done) => {
      supertest(app)
        .post('/api/user/reset_password')
        .send({ password: "test" })
        .set('Authorization', `Bearer ${resetTokenId}`)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("Please, enter a valid new password.");

          done();
        })
    })

    it("Sending valid data", (done) => {
      const newPass = "testing987";
      supertest(app)
        .post('/api/user/reset_password')
        .send({ password: newPass })
        .set('Authorization', `Bearer ${resetTokenId}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("The password is changed successfuly.");

          userData.password = newPass;
          done();
        });
    });

    it("Login for testing password reseting", (done) => {
      supertest(app)
        .post('/api/user/signin')
        .send(userData)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("You are logged in successfully");

          token = res.body.access_token;
          if (res.body.access_token.length < 500) {
            const tokenData = jwt.verify(res.body.access_token, process.env.ACCESS_TOKEN_SECRET);
            expect(mongoose.Types.ObjectId.isValid(tokenData.id)).toBe(true);
            userId = tokenData.id;
          } else {
            const tokenData = jwt.decode(res.body.access_token);
            expect(mongoose.Types.ObjectId.isValid(tokenData.sub)).toBe(true);
            userId = tokenData.sub;
          }

          done();
        })
    });
  });

  describe("Testing updateUser controller route /api/user/update_user", () => {
    it("Sending invalid token", (done) => {
      supertest(app)
        .patch("/api/user/update_user")
        .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MzUzZGNjNzQ2ZTY0OGZhOGNlNzFhZDUiLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE2Njg0NDI5NTkzMTMsImlkIjoiNjM1M2RjYzc0NmU2NDhmYThjZTcxYWQ1In0.kK6Vb9tNrGFmSTuoENsbBdvGpEKkE8PfI5ZPv5lXuUE")
        .expect(401)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("invalid signature");

          done();
        })
    });

    it("Sending request without data", (done) => {
      supertest(app)
        .patch("/api/user/update_user")
        .set("Authorization", `Bearer ${token}`)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("Please enter the new data");

          done();
        })
    })

    it("Sending correct data", (done) => {
      const newName = "testing987";
      supertest(app)
        .patch("/api/user/update_user")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: newName })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("Successfuly updates");
          expect(res.body.afterUpdatae.name).toBe(newName);

          done();
        })
    })

    it("Reset password using updateUser controller", (done) => {
      const newPass = "testing987";
      supertest(app)
        .patch("/api/user/update_user")
        .set("Authorization", `Bearer ${token}`)
        .send({ newPassword: newPass, oldPassword: userData.password })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("Successfuly updates");
          userData.password = newPass;

          done();
        })
    });

    it("Login after password reseting", (done) => {
      supertest(app)
        .post('/api/user/signin')
        .send(userData)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("You are logged in successfully");

          token = res.body.access_token;
          if (token.length < 500) {
            const tokenData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            expect(mongoose.Types.ObjectId.isValid(tokenData.id)).toBe(true);
            userId = tokenData.id;
          } else {
            const tokenData = jwt.decode(token);
            expect(mongoose.Types.ObjectId.isValid(tokenData.sub)).toBe(true);
            userId = tokenData.sub;
          }

          done();
        })
    });

  });

  describe("Testing deleteAccount controller route /api/user/delete_user", () => {
    it("Delete account successfully", (done) => {
      supertest(app)
        .delete('/api/user/delete_user')
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("Deleted account successfully");
          expect(res.body.deleted_id).toBe(userId);

          done();
        })
    })
  });
})
