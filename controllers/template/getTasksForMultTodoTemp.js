/**
 * This controller for getting multiple todo templates
 */

const Task = require("../../models/task");

const getTasksForMultiTodoTemp = async (req, res) => {
  const { page } = req.query || 1;
  try {

    const userId = req.user._id.toString();
    const limit = 25;
    const startIndex = (Number(page) - 1) * limit;

    const templates = req.body.template;
    const todoTemplates = await Task.find({ _id: { $in: templates } }).select("tasks _id");
    const tasksIds = todoTemplates.map(t => t.tasks).flat();
    const tasks = await Task.find({ "template._id": { $in: templates }, "template.todo": true, userId: userId }).limit(limit).skip(startIndex);

    res.status(200).json({
      tasks,
      total: tasksIds.length,
      currentPage: page ? Number(page) : tasksIds.length === 0 ? 0 : 1,
      numberOfPages: Math.ceil(tasksIds.length / limit)
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = getTasksForMultiTodoTemp;
