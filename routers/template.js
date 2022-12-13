const router = require("express").Router();
const templateControllers = require("./../controllers/template");

const Auth = require('./../middlewares/auth');

router.post("/add/", Auth, templateControllers.addTemplate);

module.exports = router;