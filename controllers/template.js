const Template = require("./../models/template");
const Task = require("./../models/task");
const mongoose = require("mongoose");

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
 * Write unit testing for each endpoint at __test__
 * handle endpoints testing and documents at Postman
 * update the README document
 */

const TempleteControllers = {
  /**
   * @param {body, authentication, ....} req 
   * @param {*} res 
   * 
   * first, get all proparties of the template from the request body(req.body);
   * Then validate the data before saving at database.
   * last, response with the comming data from the database
   */
  addTemplate: async (req, res) => {
    try {
      const {
        name,
        visibility,
        desc,
        tasks,
        iconURL,
        color,
        time,
        timeForAll,
        autoBreaks,
        autoPomodors,
        autoStartNextTask,
        longInterval,
        alarmType,
        alarmVolume,
        alarmRepet,
        tickingType,
        tickingVolume
      } = req.body;

      const templateData = await Template.create({
        name,
        visibility,
        description: desc,
        iconURL,
        color,
        time,
        timeForAll,
        autoBreaks,
        autoPomodors,
        autoStartNextTask,
        longInterval,
        alarmType,
        alarmVolume,
        alarmRepet,
        tickingType,
        tickingVolume,
        userId: req.userId
      });

      let est = 0;
      for (let index = 0; index < tasks.length; index++) {
        const task = tasks[index];
        if (!task.order) task.order = index;
        task.template = { _id: String(templateData._id), todo: false };
        task.userId = req.userId;
        est += task.est;
      }

      const tasksIdsData = await Task.insertMany(tasks);

      const tasksIds = tasksIdsData.map(task => task._id);

      const updateTemplate = await Template.findByIdAndUpdate(templateData._id, { tasks: tasksIds, est: est }, { new: true });

      res.status(200).json(updateTemplate);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getAll: async (req, res) => {
    const { page } = req.query || 1;
    try {
      const limit = 25;
      const startIndex = (Number(page) - 1) * limit;

      const total = await Template.countDocuments({ visibility: { $eq: true } });
      const templates = await Template.find({ visibility: { $eq: true } }).limit(limit).skip(startIndex);

      res.status(200).json({
        templates,
        total,
        currentPage: page ? Number(page) : total === 0 ? 0 : 1,
        numberOfPages: Math.ceil(total / limit)
      });

    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },
  getOne: async (req, res) => {
    try {
      const template = req.oldTemplate._doc;

      res.status(200).json(template);
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },
  getTasksForOne: async (req, res) => {
    try {
      const { id } = req.params;
      const template = req.oldTemplate._doc;
      console.log(template);

      const tasks = await Task.find({ template: { _id: id, todo: template.todo !== null } });

      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },
  getForUser: async (req, res) => {
    const { page } = req.query || 1;
    try {
      const limit = 25;
      const startIndex = (Number(page) - 1) * limit;

      const total = await Template.countDocuments({ userId: req.userId, todo: { $eq: null } }); // Template.find({ userId: req.userId });
      const templates = await Template.find({ userId: req.userId, todo: { $eq: null } }).limit(limit).skip(startIndex);

      res.status(200).json({
        templates,
        total,
        currentPage: page ? Number(page) : total === 0 ? 0 : 1,
        numberOfPages: Math.ceil(total / limit)
      });

    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },
  addToTodoList: async (req, res) => {
    try {
      const { id } = req.params;
      const { order } = req.body;
      const oldTemplate = req.oldTemplate._doc;
      delete oldTemplate._id;

      const templateData = Object.assign(oldTemplate, {
        userId: req.userId,
        todo: {
          userId: req.userId,
          order: order || 1,
        },
        visibility: false
      });

      const newTemplate = await Template.create(templateData);

      const oldTasks = await Task.find({ template: { _id: id, todo: false } });
      console.log(oldTasks);
      const tasksData = oldTasks.map(({ _doc: task }) => {
        delete task._id;
        delete task.createdAt;
        delete task.updatedAt;
        return {
          ...task,
          userId: req.userId,
          template: {
            _id: String(newTemplate._id),
            todo: true
          }
        }
      });

      const newTasks = await Task.insertMany(tasksData);
      console.log(newTasks);

      const updateTemplate = await Template.findByIdAndUpdate(newTemplate._id, { tasks: newTasks.map((task) => task._id) }, { new: true });

      res.status(200).json(updateTemplate);
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },
  getAllForTodo: async (req, res) => {
    const { page } = req.query || 1;
    try {
      const userId = req.userId;
      const limit = 25;
      const startIndex = (Number(page) - 1) * limit;
      console.log(userId);

      const total = await Template.countDocuments({ userId: userId, todo: { $ne: null } });
      const templates = await Template.find({ userId: userId, todo: { $ne: null } }).limit(limit).skip(startIndex);

      res.status(200).json({
        templates,
        total,
        currentPage: page ? Number(page) : total === 0 ? 0 : 1,
        numberOfPages: Math.ceil(total / limit)
      });
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },
  deleteTemplate: async (req, res) => {
    try {
      const oldTemplate = req.oldTemplate._doc;
      // console.log(oldTemplate);

      const deletedTemplate = await Template.findByIdAndDelete(oldTemplate._id);

      const deleatedTasks = await Task.deleteMany({ template: { _id: oldTemplate._id, todo: oldTemplate.todo === null ? false : true } });
      res.status(200).json({ deletedTemplate, deleatedTasks });
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },
  updateTemplate: async (req, res) => {
    try {
      const { id } = req.params;
      const oldTemplate = req.oldTemplate._doc;

      delete oldTemplate._id;

      const {
        name,
        desc,
        visibility,
        iconURL, // modify when making uploading controllers
        color,
        time,
        timeForAll,
        autoBreaks,
        autoPomodors,
        autoStartNextTask,
        longInterval,
        alarmType,
        alarmVolume,
        alarmRepet,
        tickingType,
        tickingVolume
      } = req.body;

      const templateBody = {
        name,
        visibility,
        description: desc,
        iconURL,
        color,
        time,
        timeForAll,
        autoBreaks,
        autoPomodors,
        autoStartNextTask,
        longInterval,
        alarmType,
        alarmVolume,
        alarmRepet,
        tickingType,
        tickingVolume
      };

      // if (name?.trim() && name?.trim()?.length > 50) return res.status(400).json({ message: "The name length is more than 50 characters." })

      // if (desc?.trim()?.length > 500 && desc?.trim()) return res.status(400).json({ message: "The notes length is more than 500 characters." })

      const updatedTemplate = await Template.findByIdAndUpdate(id, templateBody, { new: true });

      res.status(200).json(updatedTemplate);
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
};

module.exports = TempleteControllers;