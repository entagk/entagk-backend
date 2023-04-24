const Task = require("../../models/task.js");
const Template = require('../../models/template');

const increaseAct = async (req, res) => {
  try {
    const { id } = req.params;

    const task = req.oldTask;

    if (task.tasks.length > 0) return res.status(400).json({ message: "This is template not single task" })

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
};

module.exports = increaseAct;
