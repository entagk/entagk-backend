const app = require('../../server');
const supertest = require('supertest');

const { createAcessToken } = require('./../../utils/helper');
const {getData} = require('./utils');

module.exports = (url) => {
  it("Testing sending request without token", (done) => {
    supertest(app)
      .get(url)
      .expect(401)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("Invalid Authentication.");
        done();
      })
  });

  it('Testing sending request with invalid token', (done) => {
    supertest(app)
      .get(url)
      .set("Authorization", `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QwMTIzQGV4YW1wbGUuY29tIiwiaWQiOiI2MzhjMTE2NDI1ZGI3OGI1MGJjYzFjMDgiLCJpYXQiOjE2NzEwMzE5NzMsImV4cCI6MTY3MTA4OTU3M30.6lafCmgJDX393gGNakvwPbprgCHvrvVIXxUC3wSmxMg`)
      .expect(401)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("Invalid Authentication and jwt expired");

        done();
      })
  });

  it('Testing sending request with token with invalid userId', (done) => {
    const userData = getData('userData');
    const fakeToken = createAcessToken({ email: userData.email, id: "kjkljfdskfj" });
    supertest(app)
      .get(url)
      .set("Authorization", `Bearer ${fakeToken}`)
      .expect(401)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("Invalid Authentication");

        done();
      })
  })

  it('Testing sending request with token using non found user', (done) => {
    const fakeToken = createAcessToken({ email: "wjdjsifk@jfdd.com", id: '641ee1ba92578ebf24203deb' });
    supertest(app)
      .get(url)
      .set("Authorization", `Bearer ${fakeToken}`)
      .expect(404)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("user not found");

        done();
      })
  })
}
