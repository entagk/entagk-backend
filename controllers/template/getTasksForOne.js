const Task = require("../../models/task");

const getTasksForOne = async (req, res) => {
  const { page } = req.query || 1;
  try {
    const { id } = req.params;
    const template = req.oldTemplate;
    console.log(template);

    const limit = 25;
    const startIndex = (Number(page) - 1) * limit;

    const total = await Task.countDocuments({ template: { _id: id, todo: template.todo !== null } });
    const tasks = await Task.find({ template: { _id: id, todo: template.todo !== null } }).limit(limit).skip(startIndex);

    res.status(200).json({
      tasks,
      total,
      currentPage: page ? Number(page) : total === 0 ? 0 : 1,
      numberOfPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message })
  }
};

module.exports = getTasksForOne;
