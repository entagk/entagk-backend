const Task = require("../../models/task");

const addMultipleTasks = async (req, res) => {
  try {
    const tasks = req.body;

    const tasksData = await Task.insertMany(tasks);

    res.status(200).json(tasksData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = addMultipleTasks;
