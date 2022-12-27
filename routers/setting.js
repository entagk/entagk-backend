const router = require("express").Router();
const SettingControllers = require("./../controllers/setting");
const Auth = require("./../middlewares/auth");
const ValidateTimeData = require("./../middlewares/valdiateTimeData");

router.get("/", Auth, SettingControllers.getSetting);

router.post("/update/", Auth, ValidateTimeData, SettingControllers.update);

module.exports = router;