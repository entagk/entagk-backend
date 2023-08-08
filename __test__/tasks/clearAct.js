const supertest = require('supertest');
const app = require('../../server');

const { test, getTokenAndUserId, setTaskData, getTaskData } = require('./utils');

module.exports = () => describe("Testing clearAct controller route /api/task/clear_act", () => {
  it("increase act for unchecked task", (done) => {
    const taskData = getTaskData();
    supertest(app)
      .patch(`/api/task/update/${taskData[1]._id}`)
      .set("Authorization", `Bearer ${getTokenAndUserId().token}`)
      .send({ act: taskData[1].est - 1 })
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        const data = res.body;

        test(data, {
          userId: getTokenAndUserId().userId,
          ...data,
          ...taskData[1],
          updatedAt: data.updatedAt,
          check: false,
          notes: taskData[0].notes,
          act: taskData[1].est - 1,
        });
        setTaskData(data, 1);

        done();
      })
  });

  it("check task", (done) => {
    const taskData = getTaskData();
    supertest(app)
      .post(`/api/task/check/${taskData[1]._id}`)
      .set("Authorization", `Bearer ${getTokenAndUserId().token}`)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        const data = res.body;

        test(data, {
          ...data,
          ...taskData[1],
          userId, 
          check: true,
          act: taskData[1].est,
          notes: taskData[0].notes,
          updatedAt: data.updatedAt,
        });
        setTaskData(data, 1);

        done();
      })
  });

  it("clear act from tasks", (done) => {
    const taskData = getTaskData();
    supertest(app)
      .delete('/api/task/clear_act')
      .set("Authorization", `Bearer ${getTokenAndUserId().token}`)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("Successful update.");
        expect(res.body.modifiedCount).toBe(taskData.filter(task => task.act > 0).length)

        done();
      })
  })
});
