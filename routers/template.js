const router = require("express").Router();
const templateControllers = require("./../controllers/template");
const validateTemplate = require("./../middlewares/validateTemplate");
const Auth = require('./../middlewares/auth');

router.post("/add/", Auth, templateControllers.addTemplate);

router.get("/", templateControllers.getAll);

router.get(`/one/:id`, validateTemplate, templateControllers.getOne);
router.get("/one/private/:id", Auth, validateTemplate, templateControllers.getOne);

router.get("/one/tasks/:id", validateTemplate, templateControllers.getTasksForOne);
router.get("/one/tasks/private/:id", Auth, validateTemplate, templateControllers.getTasksForOne);

router.get("/user", Auth, templateControllers.getForUser);

router.post('/add_to_todo/:id', Auth, validateTemplate, templateControllers.addToTodoList);

module.exports = router;