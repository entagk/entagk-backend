const path = require('path');
const supertest = require('supertest');
const app = require('../../server');

const { getData, setData, test } = require('./utils');
const validateAuth = require('../validateAuth');

module.exports = () =>
  describe('Testing addActivity POST through router /api/active controller', () => {
    const utilsPath = path.resolve(__dirname, 'utils');
    validateAuth('/api/active', 'post', utilsPath);

    const taskData = [];

    it("send request without data", (done) => {
      const token = getData('token');
      supertest(app)
        .post('/api/active')
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;
          expect(data.message).toBe("Please, enter the active data");

          done();
        });
    });

    it("send request with invalid task data", (done) => {
      const token = getData('token');
      supertest(app)
        .post('/api/active')
        .set('Authorization', `Bearer ${token}`)
        .send({ time: { start: 154566554 }, activeTask: "kjfoj098234" })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;
          expect(data.message).toBe("The active task id is not vaild.");

          done();
        });
    });

    it("send request with unfound task id", (done) => {
      const token = getData('token');
      supertest(app)
        .post('/api/active')
        .set('Authorization', `Bearer ${token}`)
        .send({ time: { start: 154566554 }, activeTask: "64b38a5bcc7f7d0f667db668" })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;
          expect(data.message).toBe("Invalid task");

          done();
        });
    });

    it("Create task", (done) => {
      supertest(app)
        .post('/api/task/add/')
        .set("Authorization", `Bearer ${getData('token')}`)
        .send({ name: "kjdf kfdjs", est: 5 })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;

          taskData[0] = data;
          done();

        });
    });

    it('Send request without start time', (done) => {
      const token = getData('token');
      supertest(app)
        .post('/api/active')
        .set('Authorization', `Bearer ${token}`)
        .send({
          time: {},
          activeTask: taskData[0]._id
        })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;
          expect(data.message).toBe("Invalid start time");

          done();
        });
    })

    it('Send request with inavlid start time', (done) => {
      const token = getData('token');
      supertest(app)
        .post('/api/active')
        .set('Authorization', `Bearer ${token}`)
        .send({
          time: {
            start: -12343224232
          },
          activeTask: taskData[0]._id
        })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;
          expect(data.message).toBe("Invalid start time");

          done();
        });
    })

    it('Send request without end time', (done) => {
      const token = getData('token');
      supertest(app)
        .post('/api/active')
        .set('Authorization', `Bearer ${token}`)
        .send({
          time: { start: Date.now() },
          activeTask: taskData[0]._id
        })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;
          expect(data.message).toBe("Invalid end time");

          done();
        });
    })

    it('Send request with inavlid end time', (done) => {
      const token = getData('token');
      supertest(app)
        .post('/api/active')
        .set('Authorization', `Bearer ${token}`)
        .send({
          time: {
            start: Date.now(),
            end: -Date.now()
          },
          activeTask: taskData[0]._id
        })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;
          expect(data.message).toBe("Invalid end time");

          done();
        });
    });

    it('Send request without active task', (done) => {
      const token = getData('token');
      const start = Date.now();
      supertest(app)
        .post('/api/active')
        .set('Authorization', `Bearer ${token}`)
        .send({
          time: {
            start: start,
            end: start + (1000 * 60 * 30)
          },
          // activeTask: taskData[0]._id
        })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;
          const userId = getData('userId')
          test(
            data,
            {
              userId,
              day: new Date().toJSON().split('T')[0],
              tasks: [],
              types: [],
              templates: [],
              totalMins: 30
            }
          );

          setData('days', data, 0);

          done();
        });
    });

    it('Send request real active task', (done) => {
      const token = getData('token');
      const start = Date.now();
      supertest(app)
        .post('/api/active')
        .set('Authorization', `Bearer ${token}`)
        .send({
          time: {
            start: start,
            end: start + (1000 * 60 * 20)
          },
          activeTask: taskData[0]._id
        })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;
          const userId = getData('userId')
          const oldDay = getData('days')[0];
          const taskTotalMins = 20;
          test(
            data,
            {
              userId,
              day: new Date().toJSON().split('T')[0],
              tasks: [{ name: taskData[0].name, id: taskData[0]._id, totalMins: taskTotalMins }],
              types: [],
              templates: [],
              totalMins: oldDay.totalMins + taskTotalMins
            }
          );

          setData('days', data, 0);

          done();
        });
    });
  });
