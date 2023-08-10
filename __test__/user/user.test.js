const { closeDBConnect, openDBConnect } = require("../helper");

const { initializeData } = require('./utils');

beforeAll((done) => {
  openDBConnect(() => {}, false, done);
});

afterAll((done) => {
  initializeData();
  closeDBConnect(done);
});

describe('User APIs', () => {
  require('./signup')();

  require('./signin')();

  require('./getUser')();

  require('./forgetPassword')();

  require('./verifyResetId')();

  require('./resetPassword')();

  require('./refreshToken')();

  require('./updateUser')();

  require('./deleteUser')();
})
