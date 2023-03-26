/**
 * handle the order at 
 *  addTask, 
 *  updateTask,
 *  deleteTask,
 *  checkTask,
 *  and increaseAct.
 */

const taskControllers = {
  getAll: require('./getAll'),
  addTask: require('./addTask'),
  addMultipleTasks: require('./addMultipleTasks'),
  updateTask: require('./updateTask'),
  deleteTask: require('./deleteTask'),
  checkTask: require('./checkTask'),
  increaseAct: require('./increaseAct'),
  clearFinished: require('./clearFinished'),
  clearAct: require('./clearAct'),
  clearAll: require('./clearAll'),
};

module.exports = taskControllers;
