const { openDBConnect, closeDBConnect } = require('../helper');
const { setTokenAndUserId, initializeData } = require('./utils');

/**
 * Before start testing: Connect to data and then signup and put the token, and userId in json file
 */

beforeAll((done) => {
  openDBConnect(setTokenAndUserId, true, done);
});

/**
 * After the end of test: initialize the json data and close the connection
 */
afterAll((done) => {
  initializeData();
  closeDBConnect(done);
});

/**
 * Test all controllers
 */
describe("Task APIs", () => {
  require('./getAll.js')();

  require('./addTask')();

  require('./addMultipleTasks')();

  require('./updateTask')();

  require('./deleteTask')();

  require('./checkTask')();

  require('./increaseAct')();

  require('./clearFinished')();

  require('./clearAct')();

  require('./clearAll')();
})
