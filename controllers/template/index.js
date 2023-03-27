const Template = require("../../models/template"); //
const Task = require("../../models/task"); //

/**
 * addTemplate ===>> add template to database
 * getAll ===>> get all public templates from database
 * getOne ===>> get one template useing id
 * getTasksForOne ===>> get template tasks using template id
 * getForUser ===>> get all users templates
 * addToTodoList ===>> add template and make it only for todo list usage
 * getAllForTodo ===>> get templates for using at todo list
 * updataTemplate ===>> updata template for all templates (enclode todo list templates) 
 * deleteTemplate ===>> delete template for all templates (enclode todo list templates)
 * ---------------------------------------------------------------------------------------
 */

const TempleteControllers = {
  /** 
   * first, get all proparties of the template from the request body(req.body);
   * Then validate the data before saving at database.
   * last, response with the comming data from the database
   */
  addTemplate: require('./addTemplate'),
  getAll: require('./getAll'),
  getOne: require('./getOne'),
  getTasksForOne: require('./getTasksForOne'),
  getForUser: require('./getForUser'),
  addToTodoList: require('./addToTodoList'),
  getAllForTodo: require('./getAllForTodo'),
  deleteTemplate: require('./deleteTemplate'),
  updateTemplate: require('./updateTemplate'),
};

module.exports = TempleteControllers;
