const Task = require("./../models/task.js");
const Template = require('../models/template');
const mongoose = require("mongoose");

/**
 * handle the order at 
 *  addTask, 
 *  updateTask,
 *  deleteTask,
 *  checkTask,
 *  and increaseAct.
 */

const taskControllers = {
  getAll: async (req, res) => {
    const { page } = req.query;
    try {
      const limit = 12;
      const startIndex = (Number(page) - 1) * limit;

      const userId = req.userId;
      const total = await Task.countDocuments({ userId, template: null });
      const tasks = await Task.find({ userId, template: null }).sort({ check: false }).limit(limit).skip(startIndex);

      res.status(200).json({
        tasks,
        total,
        currentPage: page ? Number(page) : total === 0 ? 0 : 1,
        numberOfPages: Math.ceil(total / limit)
      });

    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },
  addTask: async (req, res) => {
    try {
      const { name, est, notes, project, order, template } = req.body;

      if (!name?.trim() || !est) return res.status(400).json({ message: "Please, complete the task data at least name and est" })
      if (est <= 0) return res.status(400).json({ message: "The est shouldn't be negative number." })
      if (name?.length > 50 && name?.trim()) return res.status(400).json({ message: "The name length is more than 50 characters." })

      if (notes?.length > 500 && notes?.trim()) return res.status(400).json({ message: "The notes length is more than 500 characters." })
      // verify the project

      const templateData = template && await Template.findById(template?._id);
      console.log(templateData);
      if (template) {
        if (!template?._id || !mongoose.Types.ObjectId.isValid(template._id)) return res.status(400).json({ message: "Invalid template" })
        else {
          template.todo = templateData.todo !== null;
        }
      }

      const newTask = await Task.create({ name, est, notes, project, order, template, userId: req.userId });
      if (template) {
        await Template.findByIdAndUpdate(template._id, { tasks: [...templateData.tasks, newTask._id], est: templateData.est + est });
      }

      res.status(200).json(newTask);
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },
  updateTask: async (req, res) => {
    try {
      const { id } = req.params;
      const oldTask = req.oldTask;

      const { name, est, act, notes, project, order } = req.body;

      if (!name && !est && !act && !notes && !project) return res.status(400).json({ message: "Please enter the data that you want to update the task to it." })
      // if (!name.trim() || !est) return res.status(400).json({ message: "Please, complete the task data at least name and est" });
      if (est <= 0) return res.status(400).json({ message: "The est shouldn't be negative number." });
      if (act < 0) return res.status(400).json({ message: "The act shouldn't be negative number." });
      if (name?.length > 50 && name?.trim()) return res.status(400).json({ message: "The name length is more than 50 characters." });

      if (notes?.length > 500 && notes?.trim()) return res.status(400).json({ message: "The notes length is more than 50 characters." });

      // const newTask = await Task.create({ name, est, notes, project, order, template, userId: req.userId });
      if (oldTask.template) {
        const templateData = await Template.findById(oldTask.template._id);
        console.log(templateData);
        await Template.findByIdAndUpdate(oldTask.template._id, { est: (templateData.est - oldTask.est) + est, act: (templateData.act - oldTask.act) + act });
      }

      const newAct = req.body.act !== undefined ? act : oldTask?.act;
      const newEst = req.body.est !== undefined ? est : oldTask?.est;

      if (newAct > newEst) return res.status(400).json({ message: "The act shouldn't be more than est." });

      const updatedTask = Object.assign(oldTask, { name, est, act, notes, project, order, check: newAct === newEst });
      const newTask = await Task.findByIdAndUpdate(id, updatedTask, { new: true });

      res.status(200).json(newTask);
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.log(error);
    }
  },
  deleteTask: async (req, res) => {
    try {
      const { id } = req.params;

      const oldTask = req.oldTask;

      if (oldTask.template._id) {
        const templateData = await Template.findById(oldTask.template._id)
        const newTasks = templateData.tasks.map(t => String(t)).filter(t => t !== id);
        await Template.findByIdAndUpdate(oldTask.template._id, { est: (templateData.est - oldTask.est), act: (templateData.act - oldTask.act), tasks: newTasks });
      }

      await Task.findByIdAndDelete(id);

      res.status(200).json({ message: "Successfully deleted", deleted_id: id });
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },
  checkTask: async (req, res) => {
    try {
      const { id } = req.params;

      const task = req.oldTask;

      const newTask = Object.assign(task, { check: !task.check, act: !task.check ? task.est : 0 })

      const updatedTask = await Task.findByIdAndUpdate(id, newTask, { new: true });

      if (task?.template?._id) {
        const templateData = await Template.findById(task.template._id);
        await Template.findByIdAndUpdate(task.template._id, { act: (templateData.act + task.act) });
      }

      res.status(200).json(updatedTask);

    } catch (error) {
      res.status(500).json({ message: error.message });
      console.log(error)
    }
  },
  increaseAct: async (req, res) => {
    try {
      const { id } = req.params;

      const task = req.oldTask;

      if (task.act === task.est) return res.status(400).json({ message: "This task is completed." });

      const newTask = Object.assign(task, { act: task.act + 1, check: task.act + 1 === task.est });

      const updatedTask = await Task.findByIdAndUpdate(id, newTask, { new: true });

      if (task.template?._id) {
        const templateData = await Template.findById(task.template._id);
        await Template.findByIdAndUpdate(task.template._id, { act: (templateData.act + 1) });
      }

      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  clearFinished: async (req, res) => {
    try {
      const userId = req.userId;

      const results = await Task.deleteMany({ userId: userId, check: true, template: null });

      res.status(200).json({ ...results, message: "Success deleting." });
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },
  clearAct: async (req, res) => {
    try {
      const usedTasks = await Task.updateMany({ userId: req.userId, template: null, act: { $gte: 1 } }, { act: 0, check: false });

      res.status(200).json({ ...usedTasks, message: "Successful update." });
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },
  clearAll: async (req, res) => {
    try {
      const deletedTasks = await Task.deleteMany({ userId: req.userId, template: null });

      res.status(200).json({ ...deletedTasks, message: "Successfully deleting." });
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },
};

module.exports = taskControllers;