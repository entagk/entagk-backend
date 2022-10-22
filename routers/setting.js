const router = require("express").Router();
const SettingControllers = require("./../controllers/setting");
const Auth = require("./../middlewares/auth");

router.get("/", Auth, SettingControllers.getSetting);

router.post("/update/", Auth, SettingControllers.update);

module.exports = router;