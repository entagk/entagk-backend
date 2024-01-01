const path = require('path');
const supertest = require('supertest');
const app = require('../../server');

const { getData, setData, test } = require('./utils');
const validateAuth = require('../validateAuth');
const { types } = require('../../utils/helper');

/**
 * 1- test the template tasks
 * 2- send the activity of 2 days
 * @returns 
 */
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

    it('Send invalid activity', (done) => {
      const token = getData('token');
      const start = Date.now();
      supertest(app)
        .post('/api/active')
        .set('Authorization', `Bearer ${token}`)
        .send({
          time: {
            start: Date.now(),
            end: start + (1000 * 60 * 61)
          },
          activeTask: taskData[0]._id
        })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;
          expect(data.message).toBe("Invalid activity");

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
              types: [{ typeData: types.at(-1), totalMins: 30 }],
              templates: [],
              totalMins: 30
            }
          );

          delete data.updatedAt;

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
          const userId = getData('userId');
          const oldDay = getData('days')[0];
          const taskTotalMins = 20;
          test(
            data,
            {
              userId,
              day: new Date().toJSON().split('T')[0],
              tasks: [{
                name: taskData[0].name,
                id: taskData[0]._id,
                totalMins: taskTotalMins,
                type: types.at(-1)
              }],
              types: [{ typeData: types.at(-1), totalMins: oldDay.totalMins + taskTotalMins }],
              templates: [],
              totalMins: oldDay.totalMins + taskTotalMins
            }
          );

          delete data.updatedAt;

          setData('days', data, 0);

          done();
        });
    });

    it("Create typed task", (done) => {
      const typedTask = { name: "kjdf kfdjs", est: 5, type: types[0] };
      supertest(app)
        .post('/api/task/add/')
        .set("Authorization", `Bearer ${getData('token')}`)
        .send(typedTask)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;

          taskData[1] = data;
          done();

        });
    });

    it('Send request typed active task', (done) => {
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
          activeTask: taskData[1]._id
        })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;
          const userId = getData('userId');
          const oldDay = getData('days')[0];
          const taskTotalMins = 20;
          test(
            data,
            {
              userId,
              day: new Date().toJSON().split('T')[0],
              tasks: [
                {
                  name: taskData[0].name,
                  id: taskData[0]._id,
                  totalMins: taskTotalMins,
                  type: types.at(-1)
                },
                {
                  name: taskData[1].name,
                  id: taskData[1]._id,
                  totalMins: taskTotalMins,
                  type: types.at(0)
                },
              ],
              types: [{ typeData: types.at(-1), totalMins: oldDay.totalMins }, { typeData: types.at(0), totalMins: taskTotalMins }],
              templates: [],
              totalMins: oldDay.totalMins + taskTotalMins
            }
          );

          delete data.updatedAt;

          setData('days', data, 0);

          done();
        });
    });

    it("Send request with 2 days activity", (done) => {
      const token = getData('token');
      const today = new Date().setHours(23, 30, 0, 0);
      const end = today + (1000 * 60 * 60)

      supertest(app)
        .post('/api/active')
        .set('Authorization', `Bearer ${token}`)
        .send({
          time: {
            start: today,
            end: end
          },
          activeTask: taskData[1]._id
        })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          const data = res.body;
          const userId = getData('userId');
          const taskTotalMins = 30;

          test(
            data,
            {
              userId,
              day: `${new Date(end).getFullYear()}-${new Date(end).getMonth() + 1}-${new Date(end).getDate() > 10 ? new Date(end).getDate() : '0' + new Date(end).getDate()}`,
              tasks: [
                {
                  name: taskData[1].name,
                  id: taskData[1]._id,
                  totalMins: taskTotalMins,
                  type: types.at(0)
                },
              ],
              types: [{ typeData: types.at(0), totalMins: taskTotalMins }],
              templates: [],
              totalMins: taskTotalMins
            }
          );

          const lastDay = getData('days')[0];
          lastDay.totalMins += taskTotalMins;
          lastDay.tasks.find(t => t.id === taskData[1]._id).totalMins += taskTotalMins;
          lastDay.types.find(t => t.typeData.name === types.at(0).name).totalMins += taskTotalMins;

          delete lastDay.updatedAt;
          delete data.updatedAt;

          setData('days', lastDay, 0);
          setData('days', data, 1);

          done();
        });
    });
  });
