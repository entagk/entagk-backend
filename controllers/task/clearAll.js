const Task = require("../../models/task.js");
// fix it
const clearAll = async (req, res) => {
  try {

    const deletedTasks = await Task.deleteMany({
      $or: [
        {// normal tasks
          userId: req.user._id.toString(),
          template: null,
          setting: null,
          tasks: { $eq: [] },
        },
        {// todo template tasks
          userId: req.user._id.toString(),
          "template.todo": true,
          tasks: { $eq: [] },
        },
        {// todo template
          userId: req.user._id.toString(),
          template: null,
          tasks: { $ne: [] },
          setting: { $ne: null },
        }
      ]
    });

    console.log(deletedTasks)

    res.status(200).json({ ...deletedTasks, message: "Successfully deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

module.exports = clearAll;
