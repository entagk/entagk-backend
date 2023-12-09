const supertest = require('supertest');
const { openDBConnect, closeDBConnect } = require('../helper');
const app = require('../../server');

let token, userId;

const setTokenAndUserId = (t, uId) => {
  token = t;
  userId = uId;
}

beforeAll((done) => {
  openDBConnect(setTokenAndUserId, true, done);
});

afterAll((done) => {
  closeDBConnect(done);
});

describe('Leaderboard APIs', () => {
  describe("testting get leaderboard", () => {
    it("getting leaderboard", (done) => {
      supertest(app)
        .get('/api/leaderboard/')
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.total).toBe(1);
          expect(res.body.users.length).toBe(1);
          expect(res.body.currentPage).toBe(1);
          expect(res.body.numberOfPages).toBe(1);

          const userData = res.body.users[0];
          delete userData.updatedAt;
          delete userData.createdAt;
          delete userData.__v;

          expect(res.body.users[0]).toStrictEqual(
            {
              _id: userId,
              name: "testing123",
              totalHours: 0,
            }
          );

          done();
        })
    })
  })
})
