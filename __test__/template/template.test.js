const supertest = require("supertest");
const app = require("../../server");

const { closeDBConnect, openDBConnect } = require('../helper');
const { verifyTemplateData, setTokenAndUserId, initializeData } = require('./utils');

beforeAll((done) => {
  openDBConnect(setTokenAndUserId, true, done);
});

afterAll((done) => {
  initializeData();
  closeDBConnect(done);
});

describe("Template APIs", () => {
  require('./addTemplate')();

  require('./getAll')();

  require('./getOne')();

  require('./getTasks')();

  require('./getForUser')();

  require('./addToTodoList')();

  require('./getAllForTodo')();

  require('./deleteTemplate')();

  require("./updateTemplate")();

  require('./addNewTasks')();

  require('./updateTasks')();
})
3
