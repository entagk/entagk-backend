const Task = require("../../models/task.js");

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const oldTask = req.oldTask;

    const { name, est, act, notes, project, order } = req.body;

    console.log(oldTask.act, oldTask.est);
    const newAct = req.body?.act !== undefined ? act : oldTask?.act;
    const newEst = req.body?.est !== undefined ? est : oldTask?.est;

    if (newAct > newEst) return res.status(400).json({ message: "The act shouldn't be more than est." });

    if (oldTask.template) {
      const templateData = await Task.findById(oldTask.template._id);
      await Task.findByIdAndUpdate(oldTask.template._id, { est: (templateData.est - oldTask.est) + newEst, act: (templateData.act - oldTask.act) + newEst });
    }

    const updatedTask = Object.assign(oldTask, { name, est: newEst, act: newAct, notes, project, order, check: newAct === newEst });
    const newTask = await Task.findByIdAndUpdate(id, updatedTask, { new: true });

    res.status(200).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
    // console.log(error);
  }
};

module.exports = updateTask;
