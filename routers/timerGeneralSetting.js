const router = require("express").Router();
const SettingControllers = require("../controllers/timerGeneralSetting/index");
const Auth = require("../middlewares/auth");
const ValidateTimeData = require("../middlewares/valdiateTimeAndAudioData");

router.get("/", Auth, SettingControllers.getSetting);

router.get("/sounds/:type", SettingControllers.getGeneralSounds);

router.post("/update/", Auth, ValidateTimeData, SettingControllers.update);

module.exports = router;
