const Task = require("../../models/task.js");
const Template = require('../../models/template');

const checkTask = async (req, res) => {
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
};

module.exports = checkTask;
