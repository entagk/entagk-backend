const Task = require("../../models/task.js"); 

const getAll = async (req, res) => {
  const { page } = req.query;
  try {
    const limit = 10;
    const startIndex = (Number(page) - 1) * limit;

    const userId = req.user._id.toString();
    const total = await Task.countDocuments({ userId, template: null });
    const tasks = await Task.find({ userId, template: null }).sort({ check: 1, est: -1,  _id: 1 }).limit(limit).skip(startIndex);

    res.status(200).json({
      tasks,
      total,
      currentPage: page ? Number(page) : total === 0 ? 0 : 1,
      numberOfPages: Math.ceil(total / limit)
    });

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

module.exports = getAll;
