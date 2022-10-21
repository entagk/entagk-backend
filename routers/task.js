const router = require("express").Router();
const Auth = require("../middlewares/auth.js");
const TaskControllers = require("./../controllers/task.js");

router.get("/", Auth, TaskControllers.getAll);

router.post("/add/", Auth, TaskControllers.addTask);

router.patch("/update/:id", Auth, TaskControllers.updateTask);

router.delete("/delete/:id", Auth, TaskControllers.deleteTask);

router.post("/check/:id", Auth, TaskControllers.checkTask);

router.post("/increase_act/:id", Auth, TaskControllers.increaseAct);

router.delete("/clear_finished/", Auth, TaskControllers.clearFinished);

router.delete("/clear_act", Auth,  TaskControllers.clearAct);

router.delete("/clear_all", Auth,  TaskControllers.clearAll);

module.exports = router;