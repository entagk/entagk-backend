const supertest = require('supertest');
const app = require('../../server');

const { getTokenAndUserId, getTaskData } = require('./utils');

module.exports = () => describe('Testing clearAll controller route /api/task/clear_all', () => {
  it("clear finished tasks", (done) => {
    const taskData = getTaskData();
    supertest(app)
      .delete('/api/task/clear_all/')
      .set('Authorization', `Bearer ${getTokenAndUserId().token}`)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("Successfully deleted.")
        expect(res.body.deletedCount).toBe(taskData.length);

        done();
      })
  })
});
