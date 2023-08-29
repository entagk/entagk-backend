const path = require('path');
const supertest = require('supertest');
const app = require('../../server');

const { getData, test } = require('./utils');
const validateAuth = require('../validateAuth');

module.exports = () =>
  describe('Testing getDays GET through router /api/active/ controller', () => {
    const utilsPath = path.resolve(__dirname, 'utils');
    validateAuth('/api/active', 'get', utilsPath);

    it('send without start and end dates', (done) => {
      const token = getData('token');
      supertest(app)
        .get('/api/active/?start=&end=')
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;
          expect(data.message).toBe("Please, enter the start and the end days");

          done();
        });
    });

    it('send start date with invalid year', (done) => {
      const token = getData('token');
      supertest(app)
        .get('/api/active/?start=203-34-23')
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;
          expect(data.message).toBe("invalid year for start date");

          done();
        });
    });

    it('send start date with invalid month', (done) => {
      const token = getData('token');
      supertest(app)
        .get('/api/active/?start=2023-34-23')
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;
          expect(data.message).toBe("invalid month for start date");

          done();
        });
    });

    it('send start date with invalid day', (done) => {
      const token = getData('token');
      supertest(app)
        .get('/api/active/?start=2023-04-503')
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;
          expect(data.message).toBe("invalid day for start date");

          done();
        });
    });

    it('send end date with invalid year', (done) => {
      const token = getData('token');
      supertest(app)
        .get('/api/active/?start=2023-04-23&end=202-34-25')
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;
          expect(data.message).toBe("invalid year for end date");

          done();
        });
    });

    it('send end date with invalid month', (done) => {
      const token = getData('token');
      supertest(app)
        .get('/api/active/?start=2023-04-23&end=2023-34-25')
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;
          expect(data.message).toBe("invalid month for end date");

          done();
        });
    });

    it('send end date with invalid day', (done) => {
      const token = getData('token');
      supertest(app)
        .get('/api/active/?start=2023-04-23&end=2023-04-250')
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;
          expect(data.message).toBe("invalid day for end date");

          done();
        });
    });

    it('get single day', (done) => {
      const token = getData('token');
      const day = new Date().toJSON().split('T')[0];
      supertest(app)
        .get(`/api/active/?start=${day}&end=${day}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;
          const oldData = getData('days')[0];
          test(data, oldData);

          done();
        });
    });

    it("test dates with negative different", (done) => {
      const start = new Date(
        new Date().setDate(
          new Date().getDate() + 2)
      )
        .toJSON().split('T')[0];
      const end = new Date().toJSON().split('T')[0];

      supertest(app)
        .get(`/api/active/?start=${start}&end=${end}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe('Invalid start and end days');

          done();
        })
    });

    it("test dates with different 32 days", (done) => {
      const end = new Date(
        new Date().setDate(
          new Date().getDate() + 32)
      )
        .toJSON().split('T')[0];
      const start = new Date().toJSON().split('T')[0];

      supertest(app)
        .get(`/api/active/?start=${start}&end=${end}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          expect(res.body.message).toBe("Sorry, the limit is 31 days.");

          done();
        })
    });

    it("get week data", (done) => {
      const end = new Date(
        new Date().setDate(
          new Date().getDate() + 6)
      )
        .toJSON().split('T')[0];
      const start = new Date().toJSON().split('T')[0];

      supertest(app)
        .get(`/api/active/?start=${start}&end=${end}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          test(res.body, getData('days'))

          done();
        })
    });
  });
