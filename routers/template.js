const router = require("express").Router();
const templateControllers = require("./../controllers/template");
const validateTemplate = require("./../middlewares/validateTemplate");
const Auth = require('./../middlewares/auth');
const ValidateTimeData = require('./../middlewares/valdiateTimeData');

router.post("/add/", Auth,  ValidateTimeData, templateControllers.addTemplate);

router.get("/", templateControllers.getAll);

router.get(`/one/:id`, validateTemplate, templateControllers.getOne);
router.get("/one/private/:id", Auth, validateTemplate, templateControllers.getOne);

router.get("/one/tasks/:id", validateTemplate, templateControllers.getTasksForOne);
router.get("/one/tasks/private/:id", Auth, validateTemplate, templateControllers.getTasksForOne);

router.get("/user", Auth, templateControllers.getForUser);

router.get("/todo/", Auth, templateControllers.getAllForTodo);

router.post('/todo/:id', Auth, validateTemplate, templateControllers.addToTodoList);

router.delete("/:id", Auth, validateTemplate, templateControllers.deleteTemplate);

router.patch("/:id", Auth, validateTemplate,  ValidateTimeData, templateControllers.updateTemplate);

module.exports = router;