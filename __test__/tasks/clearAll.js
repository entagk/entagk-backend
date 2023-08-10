const path = require('path');
const supertest = require('supertest');
const app = require('../../server');

const { getData } = require('./utils');
const validateAuth = require('../validateAuth')

module.exports = () => describe('Testing clearAll controller route /api/task/clear_all', () => {
  const utilsPath = path.resolve(__dirname, 'utils.js');
  validateAuth('/api/task/', 'get', utilsPath)

  it("clear finished tasks", (done) => {
    const taskData = getData('taskData');
    supertest(app)
      .delete('/api/task/clear_all/')
      .set('Authorization', `Bearer ${getData('token')}`)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.message).toBe("Successfully deleted.")
        expect(res.body.deletedCount).toBe(3);

        done();
      })
  })
});
