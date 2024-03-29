const Task = require("../../models/task");

const getAllForTodo = async (req, res) => {
  const { page } = req.query || 1;
  try {
    const userId = req.user._id.toString();
    const limit = 25;
    const startIndex = (Number(page) - 1) * limit;

    const total = await Task.countDocuments({ userId: userId, tasks: { $ne: [] }, template: { $eq: null } });
    const templates = await Task.find({ userId: userId, tasks: { $ne: [] }, template: { $eq: null } }).limit(limit).skip(startIndex);

    res.status(200).json({
      templates,
      total,
      currentPage: page ? Number(page) : total === 0 ? 0 : 1,
      numberOfPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

module.exports = getAllForTodo;
