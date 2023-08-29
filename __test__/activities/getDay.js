const path = require('path');
const supertest = require('supertest');
const app = require('../../server');

const { getData, test } = require('./utils');
const validateAuth = require('../validateAuth');

module.exports = () =>
  describe('Testing getDay GET through router /api/active/:day controller', () => {
    const utilsPath = path.resolve(__dirname, 'utils');
    validateAuth('/api/active', 'get', utilsPath);

    it('send invalid year', (done) => {
      const token = getData('token');
      supertest(app)
        .get('/api/active/203-34-23')
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;
          expect(data.message).toBe("invalid year");

          done();
        });
    })

    it('send invalid month', (done) => {
      const token = getData('token');
      supertest(app)
        .get('/api/active/2023-34-23')
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;
          expect(data.message).toBe("invalid month");

          done();
        });
    })

    it('send invalid day', (done) => {
      const token = getData('token');
      supertest(app)
        .get('/api/active/2023-04-252')
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;
          expect(data.message).toBe("invalid day");

          done();
        });
    })

    it('send unfound day', (done) => {
      const token = getData('token');
      supertest(app)
        .get(`/api/active/${new Date(
          new Date().setDate(
            new Date().getDate() + 1)
        )
            .toJSON().split('T')[0]}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;
          expect(data).toBe(null);

          done();
        });
    })

    it('send unfound day', (done) => {
      const token = getData('token');
      supertest(app)
        .get(`/api/active/${new Date().toJSON().split('T')[0]}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;
          const oldDay = getData('days')[0];
          test(data, oldDay);

          done();
        });
    })
  });
