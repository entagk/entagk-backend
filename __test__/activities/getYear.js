const path = require('path');
const supertest = require('supertest');
const app = require('../../server');

const { getData, test } = require('./utils');
const validateAuth = require('../validateAuth');

module.exports = () =>
  describe('Testing getYears GET through router /api/active/year controller', () => {
    const utilsPath = path.resolve(__dirname, 'utils');
    validateAuth('/api/active/year', 'get', utilsPath);

    it('send without year query', (done) => {
      const token = getData('token');
      supertest(app)
        .get('/api/active/year?year=')
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;
          expect(data.message).toBe("Invalid year value");

          done();
        });
    });

    it('send with invalid year', (done) => {
      const token = getData('token');
      supertest(app)
        .get('/api/active/year?year=202')
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;
          expect(data.message).toBe("Invalid year");

          done();
        });
    });

    it('get the year data', (done) => {
      const token = getData('token');
      const year = new Date().getFullYear();
      supertest(app)
        .get(`/api/active/year?year=${year}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;
          const oldData = getData('days');
          expect(data).toStrictEqual(oldData.map((d) => ({ _id: d._id, totalMins: d.totalMins, userId: d.userId, day: d.day })));

          done();
        });
    });
  });
