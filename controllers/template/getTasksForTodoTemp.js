const Task = require('./../../models/task');

const getTasksForTodoTemp = async (req, res) => {
  const { page } = req.query || 1;
  const {id} = req.params;
  try {
    const userId = req.user._id.toString();
    const limit = 25;
    const startIndex = (Number(page) - 1) * limit;

    const total = await Task.countDocuments({ userId: userId, "template.todo": true, "template._id": id });
    const tasks = await Task.find({ userId: userId, "template.todo": true, "template._id": id }).limit(limit).skip(startIndex);

    res.status(200).json({
      tasks,
      total,
      currentPage: page ? Number(page) : total === 0 ? 0 : 1,
      numberOfPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = getTasksForTodoTemp;
