const router = require("express").Router();
const Auth = require("../middlewares/auth.js");
const ValidTask = require('../middlewares/validateTask');
const validateTaskData = require("../middlewares/validateTaskData");
const ValidateMultiTasksData = require('../middlewares/validateMultiTasksData');
const TaskControllers = require("./../controllers/task.js");

router.get("/", Auth, TaskControllers.getAll);

router.post("/add/", Auth, validateTaskData, TaskControllers.addTask);
router.post("/add_multiple_tasks", Auth, ValidateMultiTasksData, TaskControllers.addMultipleTasks);

router.patch("/update/:id", Auth, ValidTask, validateTaskData, TaskControllers.updateTask);

router.delete("/delete/:id", Auth, ValidTask, TaskControllers.deleteTask);

router.post("/check/:id", Auth, ValidTask, TaskControllers.checkTask);

router.post("/increase_act/:id", Auth, ValidTask, TaskControllers.increaseAct);

router.delete("/clear_finished/", Auth, TaskControllers.clearFinished);

router.delete("/clear_act/", Auth,  TaskControllers.clearAct);

router.delete("/clear_all/", Auth,  TaskControllers.clearAll);

module.exports = router;
