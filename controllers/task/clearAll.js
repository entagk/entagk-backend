const Task = require("../../models/task.js");

const clearAct = async (req, res) => {
  try {
    const deletedTasks = await Task.deleteMany({ userId: req.user._id.toString(), template: null });

    res.status(200).json({ ...deletedTasks, message: "Successfully deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

module.exports = clearAct;
