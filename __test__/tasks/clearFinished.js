const supertest = require('supertest');
const app = require('../../server');

const { test, getTokenAndUserId, setTaskData, getTaskData } = require('./utils');

module.exports = () => describe("Testing clearFinished controller route /api/task/clear_finished/", () => {
  it("Add two tasks", (done) => {
    const taskData = getTaskData();
    supertest(app)
      .post('/api/task/add_multiple_tasks')
      .set("Authorization", `Bearer ${getTokenAndUserId().token}`)
      .send([{ ...taskData[0], est: 9 }, { ...taskData[0], est: 5 }])
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        const data = res.body;

        const { userId } = getTokenAndUserId();

        test(data[0], { userId, check: false, notes: taskData[0].notes, act: 0, est: 9, name: taskData[0].name });
        test(data[1], { userId, check: false, notes: taskData[0].notes, act: 0, est: 5, name: taskData[0].name });

        setTaskData(Object.assign(taskData[0], data), taskData.length);
        setTaskData(Object.assign(taskData[0], data), taskData.length + 1);

        done();
      })
  })

  it("check task", (done) => {
    const taskData = getTaskData();
    supertest(app)
      .post(`/api/task/check/${taskData[1]._id}`)
      .set("Authorization", `Bearer ${getTokenAndUserId().token}`)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        const data = res.body;

        test(data, { check: true, act: taskData[1].est });

        setTaskData(data, 1);

        done();
      })
  })

  it("clear finished tasks", (done) => {
    const taskData = getTaskData();
    supertest(app)
      .delete('/api/task/clear_finished/')
      .set('Authorization', `Bearer ${getTokenAndUserId().token}`)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("Success deleted.")
        expect(res.body.deletedCount).toBe(taskData.filter((t) => t.check).length);
        setTaskData(taskData.filter(task => !task?.check));

        done();
      })
  })
});
