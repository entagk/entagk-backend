const Task = require("../../models/task.js");

const checkTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = Object.freeze(req.oldTask);
    const taskAct = task.act;
    const taskEst = task.est;

    if (!task.template?.todo && task.template !== null) {
      return res.status(400).json({ message: "invalid template task" })
    }

    if (task.tasks.length > 0) return res.status(400).json({ message: "This is template not single task" })

    const newTask = { check: !task.check, act: !task.check ? task.est : 0 }

    const updatedTask = await Task.findByIdAndUpdate(id, newTask, { new: true });

    if (task?.template?._id && task.template?.todo) {
      const templateData = await Task.findById(task.template._id);

      const templateAct = newTask.check ? (templateData.act - taskAct) + taskEst : templateData.act - taskAct;

      const newTemp = { act: templateAct, check: templateAct === templateData.est };

      await Task.findByIdAndUpdate(templateData._id, newTemp, { new: true });
    }

    res.status(200).json(updatedTask);

  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error)
  }
};

module.exports = checkTask;
