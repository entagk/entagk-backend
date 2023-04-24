const Task = require("../../models/task.js");

const clearAct = async (req, res) => {
  try {
    const usedTasks = await Task.updateMany({ userId: req.user._id.toString(), template: null, tasks: { $eq: [] }, act: { $gte: 1 } }, { act: 0, check: false });

    res.status(200).json({ ...usedTasks, message: "Successful update." });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

module.exports = clearAct;
