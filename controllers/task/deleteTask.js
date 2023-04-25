const Task = require("../../models/task");
const Template = require("../../models/template");

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const oldTask = req.oldTask;
    console.log(oldTask);

    if (oldTask.template?._id) {
      if (oldTask.template.todo) {
        const templateData = await Task.findById(oldTask.template._id)
        const newTasks = templateData.tasks.map(t => String(t)).filter(t => t !== id);
        await Task.findByIdAndUpdate(oldTask.template._id, { est: (templateData.est - oldTask.est), act: (templateData.act - oldTask.act), tasks: newTasks });
      } else {
        const templateData = await Template.findById(oldTask.template._id)
        const newTasks = templateData.tasks.map(t => String(t)).filter(t => t !== id);
        await Template.findByIdAndUpdate(oldTask.template._id, { est: (templateData.est - oldTask.est), act: (templateData.act - oldTask.act), tasks: newTasks });
      }
    }

    await Task.findByIdAndDelete(id);

    res.status(200).json({ message: "Successfully deleted", deleted_id: id });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

module.exports = deleteTask;
