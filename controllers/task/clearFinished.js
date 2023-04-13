const Task = require("../../models/task.js");

const clearFinished = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const results = await Task.deleteMany({ userId: userId, check: true, template: null });

    res.status(200).json({ ...results, message: "Success deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

module.exports = clearFinished;
