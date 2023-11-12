const Task = require("../../models/task.js");
const Template = require('../../models/template');

const addTask = async (req, res) => {
  try {
    const { name, est, notes, project, order, template, type } = req.body;

    const templateData = req.templateData;

    const newTask = await Task.create({
      name,
      est,
      notes,
      project,
      order,
      template,
      userId: req.user._id.toString(),
      type
    });

    if (template?._id) {
      if (template?.todo) {
        await Task.findByIdAndUpdate(template?._id, { tasks: [...templateData.tasks, newTask._id], est: templateData.est + est });
      } else {
        await Template.findByIdAndUpdate(
          template?._id,
          {
            tasks: [...templateData.tasks, newTask._id],
            est: templateData.est + est
          }, {
          new: true
        });
      }
    }

    res.status(200).json(newTask);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message })
  }
};

module.exports = addTask;
