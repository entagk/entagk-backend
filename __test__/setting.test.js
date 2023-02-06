// const supertest = require("supertest");
// const app = require("../server");
// const jwt = require('jsonwebtoken');
// const mongoose = require("mongoose");

// const MONGODB_URL = "mongodb://localhost:27017/?authMechanism=DEFAULT";

// let userId, token;

// beforeAll((done) => {
//   mongoose.connect(MONGODB_URL,
//     { useNewUrlParser: true, useUnifiedTopology: true },
//     () => done());
// });

// /**
//  * Before start in testing: Sign up the user and get the token for authorization for every test.
//  */
// beforeAll(async () => {
//   const userData = { name: "testing123", email: "testing123@test.com", password: "testing123" };

//   const res = await supertest(app).post('/api/user/signup').send(userData)

//   token = res.body.token;

//   if (res.body.token?.length < 500) {
//     const tokenData = jwt.verify(res.body.token, process.env.ACCESS_TOKEN_SECRET);
//     expect(mongoose.Types.ObjectId.isValid(tokenData.id)).toBe(true);
//     userId = tokenData?.id;
//   } else {
//     const tokenData = jwt.decode(res.body.token);
//     expect(mongoose.Types.ObjectId.isValid(tokenData.sub)).toBe(true);
//     userId = tokenData?.sub;
//   }
// })

// afterAll((done) => {
//   mongoose.connection.db.dropDatabase(() => {
//     mongoose.connection.close(() => done());
//     console.log("done")
//   });
// });

// describe("Account Setting API", () => {
//   let settingData;
//   describe("Testing getSetting controller route /api/setting/ with GET", () => {
//     it("Getting setting succesfully", (done) => {
//       supertest(app)
//         .get("/api/setting/")
//         .set("Authorization", `Bearer ${token}`)
//         .expect(200)
//         .end((err, res) => {
//           if (err) throw err;

//           settingData = res.body;
//           expect(settingData.format).toBe("analog");

//           expect(settingData.time).toStrictEqual({
//             ["PERIOD"]: 1500,
//             ["SHORT"]: 300,
//             ["LONG"]: 900,
//           });

//           expect(settingData.autoBreaks).toBe(false)
//           expect(settingData.autoPomodors).toBe(false);
//           expect(settingData.autoStartNextTask).toBe(false);

//           expect(settingData.longInterval).toBe(4);

//           expect(settingData.alarmType).toStrictEqual({
//             name: "alarm 1",
//             src: 'sounds/alarm/1.mp3'
//           });

//           expect(settingData.alarmVolume).toBe(50);
//           expect(settingData.alarmRepet).toBe(false);

//           expect(settingData.tickingType).toStrictEqual({
//             name: "tricking 1",
//             src: "sounds/tricking/1.mp3"
//           });

//           expect(settingData.tickingVolume).toBe(50);

//           expect(settingData.clickType).toStrictEqual({
//             name: "can opening pop",
//             src: "sounds/click/can-opening-pop-101856.mp3"
//           });

//           expect(settingData.clickVolume).toBe(50);

//           expect(settingData.focusMode).toBe(false);

//           expect(settingData.notificationType).toBe("last");

//           expect(settingData.notificationInterval).toBe(5);

//           expect(settingData.userId).toBe(userId);

//           done();
//         })
//     })
//   })

//   describe("Testing update setting route /api/setting/ with POST", () => {
//     it("Sending request Without sending data", (done) => {
//       supertest(app)
//         .post("/api/setting/update")
//         .set("Authorization", `Bearer ${token}`)
//         .expect(400)
//         .end((err, res) => {
//           if (err) throw err;

//           expect(res.body.message).toBe("No valid data sended");

//           done();
//         })
//     })

//     it("Sending invalid timer format", (done) => {
//       supertest(app)
//         .post("/api/setting/update")
//         .set("Authorization", `Bearer ${token}`)
//         .send({ format: "kfjdsf" })
//         .expect(400)
//         .end((err, res) => {
//           if (err) throw err;

//           expect(res.body.message).toBe("invalid timer format");

//           done();
//         })
//     })

//     it("Sending invalid time", (done) => {
//       supertest(app)
//         .post("/api/setting/update")
//         .set("Authorization", `Bearer ${token}`)
//         .send({
//           time: {
//             ["PERIOD"]: -1500,
//           }
//         })
//         .expect(400)
//         .end((err, res) => {
//           if (err) throw err;

//           expect(res.body.message)
//             .toBe("The time should be at this format {PERIOD: ---, SHORT: ---, LONG: ---} with positive numbers");

//           done();
//         })
//     })

//     it("Sending invalid autoBreaks", (done) => {
//       supertest(app)
//         .post("/api/setting/update")
//         .set("Authorization", `Bearer ${token}`)
//         .send({
//           autoBreaks: "false"
//         })
//         .expect(400)
//         .end((err, res) => {
//           if (err) throw err;

//           expect(res.body.message)
//             .toBe("The property of the autoBreaks is boolean");

//           done();
//         })
//     })

//     it("Sending invalid autoPomodors", (done) => {
//       supertest(app)
//         .post("/api/setting/update")
//         .set("Authorization", `Bearer ${token}`)
//         .send({
//           autoPomodors: "DSfa"
//         })
//         .expect(400)
//         .end((err, res) => {
//           if (err) throw err;

//           expect(res.body.message)
//             .toBe("The property of the autoPomodors is boolean");

//           done();
//         })
//     })

//     it("Sending invalid autoStartNextTask", (done) => {
//       supertest(app)
//         .post("/api/setting/update")
//         .set("Authorization", `Bearer ${token}`)
//         .send({
//           autoStartNextTask: 54
//         })
//         .expect(400)
//         .end((err, res) => {
//           if (err) throw err;

//           expect(res.body.message)
//             .toBe("The property of the autoStartNextTask is boolean");

//           done();
//         })
//     })

//     it("Sending invalid alarmVolume", (done) => {
//       supertest(app)
//         .post("/api/setting/update")
//         .set("Authorization", `Bearer ${token}`)
//         .send({
//           alarmVolume: -55
//         })
//         .expect(400)
//         .end((err, res) => {
//           if (err) throw err;

//           expect(res.body.message)
//             .toBe("invalid sound volume");

//           done();
//         })
//     })

//     it("Sending invalid longInterval", (done) => {
//       supertest(app)
//         .post("/api/setting/update")
//         .set("Authorization", `Bearer ${token}`)
//         .send({
//           longInterval: -55
//         })
//         .expect(400)
//         .end((err, res) => {
//           if (err) throw err;

//           expect(res.body.message)
//             .toBe("The long interval must be more than 2");

//           done();
//         })
//     })

//     it("Sending invalid alarmType", (done) => {
//       supertest(app)
//         .post("/api/setting/update")
//         .set("Authorization", `Bearer ${token}`)
//         .send({
//           alarmType: {
//             name: "dkjsfajd"
//           }
//         })
//         .expect(400)
//         .end((err, res) => {
//           if (err) throw err;

//           expect(res.body.message)
//             .toBe("The sound type should be contines name and src.");

//           done();
//         })
//     })

//     it("Sending invalid focusMode", (done) => {
//       supertest(app)
//         .post("/api/setting/update")
//         .set("Authorization", `Bearer ${token}`)
//         .send({
//           focusMode: "fdksja"
//         })
//         .expect(400)
//         .end((err, res) => {
//           if (err) throw err;

//           expect(res.body.message)
//             .toBe("The property of the focusMode is boolean");

//           done();
//         })
//     })

//     it("Sending invalid notificationType", (done) => {
//       supertest(app)
//         .post("/api/setting/update")
//         .set("Authorization", `Bearer ${token}`)
//         .send({
//           notificationType: "fdksja"
//         })
//         .expect(400)
//         .end((err, res) => {
//           if (err) throw err;

//           expect(res.body.message)
//             .toBe("Choose the notification type from one of last or every");

//           done();
//         })
//     })

//     it("Sending invalid notificationInterval", (done) => {
//       supertest(app)
//         .post("/api/setting/update")
//         .set("Authorization", `Bearer ${token}`)
//         .send({
//           notificationInterval: -1
//         })
//         .expect(400)
//         .end((err, res) => {
//           if (err) throw err;

//           expect(res.body.message)
//             .toBe("Invalid notification interval between 1 and 60");

//           done();
//         })
//     })

//     it("Sending valid data", (done) => {
//       supertest(app)
//         .post("/api/setting/update")
//         .set("Authorization", `Bearer ${token}`)
//         .send({
//           format: "digital",
//           time: { PERIOD: 21, SHORT: 1, LONG: 10 },
//           alarmVolume: 0,
//           tickingVolume: 1,
//           clickVolume: 0,
//         })
//         .expect(200)
//         .end((err, res) => {
//           if (err) throw err;

//           expect(res.body.format).toBe('digital');
//           expect(res.body.time).toStrictEqual({ PERIOD: 21, SHORT: 1, LONG: 10});
//           expect(res.body.alarmVolume).toBe(0);
//           expect(res.body.clickVolume).toBe(0);
//           expect(res.body.tickingVolume).toBe(1);

//           done();
//         })
//     })

//   })
// })