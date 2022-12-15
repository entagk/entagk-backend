const router = require("express").Router();
const templateControllers = require("./../controllers/template");
const validateTemplate = require("./../middlewares/validateTemplate");
const Auth = require('./../middlewares/auth');

router.post("/add/", Auth, templateControllers.addTemplate);

router.get("/", templateControllers.getAll);

router.get("/:id", validateTemplate, templateControllers.getOne);
router.get("/private/:id", Auth, validateTemplate, templateControllers.getOne);

router.get("/tasks/:id", validateTemplate, templateControllers.getTasksForOne);
router.get("/tasks/private/:id", Auth, validateTemplate, templateControllers.getTasksForOne);

module.exports = router;