const Task = require("../../models/task");

const getTasksForOne = async (req, res) => {
  try {
    const { id } = req.params;
    const template = req.oldTemplate._doc;
    console.log(template);

    const tasks = await Task.find({ template: { _id: id, todo: template.todo !== null } });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

module.exports = getTasksForOne;
