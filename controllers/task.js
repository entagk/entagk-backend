const { default: mongoose } = require("mongoose");
const Task = require("./../models/task.js");

const taskControllers = {
  getAll: async (req, res) => {
    const { page } = req.query;
    try {
      const limit = 12;
      const startIndex = (Number(page) - 1) * limit;

      const userId = req.userId;
      const total = await Task.countDocuments({ userId });
      const tasks = await Task.find({ userId }).sort({ check: false }).limit(limit).skip(startIndex);

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
      const { name, est, notes, project } = req.body;

      if (!name?.trim() || !est) return res.status(400).json({ message: "Please, complete the task data at least name and est" })
      if (est <= 0) return res.status(400).json({ message: "The est shouldn't be negative number." })
      if (name?.length > 50 && name?.trim()) return res.status(400).json({ message: "The name length is more than 50 characters." })

      if (notes?.length > 500 && notes?.trim()) return res.status(400).json({ message: "The notes length is more than 50 characters." })
      // verify the project

      const newTask = await Task.create({ name, est, notes, project, userId: req.userId });

      res.status(200).json(newTask);
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },
  updateTask: async (req, res) => {
    try {
      const { id } = req.params;

      const { name, est, act, notes, project } = req.body;

      if(!name && !est && !act && !notes && !project) return res.status(400).json({message: "Please enter the data that you want to update the task to it."})
      // if (!name.trim() || !est) return res.status(400).json({ message: "Please, complete the task data at least name and est" });
      if (est <= 0) return res.status(400).json({ message: "The est shouldn't be negative number." });
      if (act < 0) return res.status(400).json({ message: "The act shouldn't be negative number." });
      if (name?.length > 50 && name?.trim()) return res.status(400).json({ message: "The name length is more than 50 characters." });
      
      if (notes?.length > 500 && notes?.trim()) return res.status(400).json({ message: "The notes length is more than 50 characters." });
      
      const oldTask = req.oldTask;

      const newAct = req.body.act !== undefined ? act : oldTask?.act;
      const newEst = req.body.est !== undefined ? est : oldTask?.est;

      if (newAct > newEst) return res.status(400).json({ message: "The act shouldn't be more than est." });

      const updatedTask = Object.assign(oldTask, { name, est, act, notes, project, check: newAct === newEst });
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

      await Task.findByIdAndDelete(id);

      res.status(200).json({ message: "Successfully deleted", deleted_id: id });
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },
  checkTask: async (req, res) => {
    try {
      const { id } = req.params;

      let task = req.oldTask;

      const newTask = Object.assign(task, { check: !task.check, act: !task.check ? task.est : 0 })

      const updatedTask = await Task.findByIdAndUpdate(id, newTask, { new: true });;

      res.status(200).json(updatedTask)

    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },
  increaseAct: async (req, res) => {
    try {
      const { id } = req.params;
      
      const task = req.oldTask;

      if (task.act === task.est) return res.status(400).json({ message: "This task is completed." });

      const newTask = Object.assign(task, { act: task.act + 1, check: task.act + 1 === task.est });

      const updatedTask = await Task.findByIdAndUpdate(id, newTask, { new: true });

      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },
  clearFinished: async (req, res) => {
    try {
      const userId = req.userId;

      const results = await Task.deleteMany({ userId: userId, check: true });

      res.status(200).json({ ...results, message: "Success deleting." });
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },
  clearAct: async (req, res) => {
    try {
      const usedTasks = await Task.updateMany({ userId: req.userId, act: { $gte: 1 } }, { act: 0, check: false });

      res.status(200).json({ ...usedTasks, message: "Successful update." });
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },
  clearAll: async (req, res) => {
    try {
      const deletedTasks = await Task.deleteMany({ userId: req.userId });

      res.status(200).json({ ...deletedTasks, message: "Successfully deleting." });
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },
};

module.exports = taskControllers;