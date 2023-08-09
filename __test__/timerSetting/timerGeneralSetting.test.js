const { closeDBConnect, openDBConnect } = require('../helper');

const { setTokenAndUserId, initializeData } = require('./utils');

beforeAll((done) => {
  openDBConnect(setTokenAndUserId, true, done);
});

afterAll((done) => {
  initializeData();
  closeDBConnect(done);
});

describe("Timer Setting API", () => {
  require('./getSetting')();

  require('./updateSettings')();
})
