const mongoose = require("mongoose");
const Task = require('./../models/task');

const ValidTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });

    const oldTask = await Task.findById(id);

    if (!oldTask?._id) return res.status(404).json({ message: "This task doesn't found." });

    if (oldTask?.userId !== req.userId) return res.status(401).json({ message: "This task doesn't belong to you." });

    req.oldTask = oldTask;
    next();

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = ValidTask;