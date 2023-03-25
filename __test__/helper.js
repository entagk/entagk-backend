const supertest = require("supertest");
const app = require("../server");
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");

const MONGODB_URL = "mongodb://127.0.0.1:27017/?authMechanism=DEFAULT";


const openDBConnect = (setData, done) => {
  mongoose.connect(MONGODB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
  ).then(async () => {
    const userData = { name: "testing123", email: "testing123@test.com", password: "testing123" };

    const res = await supertest(app).post('/api/user/signup').send(userData)

    console.log(res.body);
    token = res.body.access_token;

    if (token?.length < 500) {
      const tokenData = jwt.verify(res.body.access_token, process.env.ACCESS_TOKEN_SECRET);
      console.log(tokenData);
      expect(mongoose.Types.ObjectId.isValid(tokenData.id)).toBe(true);
      userId = tokenData?.id;
    } else {
      const tokenData = jwt.decode(res.body.access_token);
      console.log(tokenData);
      expect(mongoose.Types.ObjectId.isValid(tokenData.id)).toBe(true);
      userId = tokenData?.id;
    }
    
    setData(token, userId);
    done();
  });
}

const closeDBConnect = (done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
    console.log("done")
  });
}


module.exports = { closeDBConnect, openDBConnect }
