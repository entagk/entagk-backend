const Task = require("../../models/task.js");
const Template = require("../../models/template.js")

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const oldTask = req.oldTask;

    const { name, est, act, notes, project, order, setting, type } = req.body;

    const newAct = req.body?.act !== undefined ? act : oldTask?.act;
    const newEst = req.body?.est !== undefined ? est : oldTask?.est;

    if (newAct > newEst) return res.status(400).json({
      errors: {
        act: "The act shouldn't be more than est."
      }
    });

    const newTask = { name, est: newEst, act: newAct, notes, project, order, check: newAct === newEst, setting, type };
    const updatedTask = await Task.findByIdAndUpdate(id, newTask, { new: true });

    if (oldTask.template) {
      const templateData = oldTask.template.todo ? await Task.findById(oldTask.template._id) : await Template.findById(oldTask.template._id);

      const newTempAct = templateData.act - oldTask.act + newAct;
      const newTempEst = templateData.est - oldTask.est + newEst;

      if (oldTask.template.todo) {
        await Task.findByIdAndUpdate(oldTask.template._id, { est: newTempEst, act: newTempAct, check: newTempAct === newTempEst }, { new: true });
      } else {
        await Template.findByIdAndUpdate(oldTask.template._id, { est: newTempEst }, { new: true });
      }
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
    // console.log(error);
  }
};

module.exports = updateTask;
