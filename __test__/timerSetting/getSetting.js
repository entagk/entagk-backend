const path = require('path');
const supertest = require('supertest');
const app = require('./../../server');
const validateAuth = require('../validateAuth');
const { setData, getData, verifySetting } = require('./utils');

module.exports = () => describe("Testing getSetting controller route /api/setting/ with GET", () => {
  const utilsPath = path.resolve(__dirname, 'utils.js');
  validateAuth('/api/setting/', 'get', utilsPath);

  const initSetting = {
    format: "analog",
    time: {
      ["PERIOD"]: 1500,
      ["SHORT"]: 300,
      ["LONG"]: 900,
    },
    autoBreaks: false,
    autoPomodors: false,
    autoStartNextTask: false,
    longInterval: 4,
    alarmType: {
      name: "alarm 1",
      src: 'sounds/alarm/1.mp3'
    },
    alarmVolume: 50,
    alarmRepet: 0,
    tickingType: {
      name: "tricking 1",
      src: "sounds/tricking/1.mp3"
    },
    tickingVolume: 50,
    clickType: {
      name: "can opening pop",
      src: "sounds/click/can-opening-pop-101856.mp3"
    },
    clickVolume: 50,
    focusMode: false,
    notificationType: "last",
    notificationInterval: 5,
  };

  it("Getting setting succesfully", (done) => {
    supertest(app)
      .get("/api/setting/")
      .set("Authorization", `Bearer ${getData("token")}`)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        setData('settingData', res.body);
        verifySetting(res.body, { ...initSetting, userId: getData("userId") });

        done();
      })
  })
})
