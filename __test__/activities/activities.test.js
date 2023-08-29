const { openDBConnect, closeDBConnect } = require('../helper');

const { initializeData, setTokenAndUserId } = require('./utils');

beforeAll((done) => {
  openDBConnect(setTokenAndUserId, true, done);
});

afterAll((done) => {
  initializeData();
  closeDBConnect(done);
});

describe('Activities APIs', () => {
  require('./addActivity')();

  require('./getDay')();
})

