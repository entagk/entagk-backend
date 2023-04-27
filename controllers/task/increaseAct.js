const Task = require("../../models/task.js");

const increaseAct = async (req, res) => {
  try {
    const { id } = req.params;

    const task = req.oldTask;

    if (!task.template?.todo) {
      return res.status(400).json({ message: "invalid template task" })
    }

    if (task.tasks.length > 0) return res.status(400).json({ message: "This is template not single task" })

    if (task.act === task.est) return res.status(400).json({ message: "This task is completed." });

    const newTask = { act: task.act + 1, check: task.act + 1 === task.est };

    const updatedTask = await Task.findByIdAndUpdate(id, newTask, { new: true });

    if (task.template?._id) {
      const templateData = await Task.findById(task.template._id);
      const newAct = templateData.act + 1;
      await Task.findByIdAndUpdate(task.template._id, { act: newAct, check: newAct === templateData.est }, { new: true });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = increaseAct;
