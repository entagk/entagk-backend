const Task = require("../../models/task.js");

// fix it

const clearFinished = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const results = await Task.deleteMany({ 
      $or: [
        {
          userId: userId, 
          check: true, 
          template: null,
          setting: null,
          tasks: { $eq: [] }
        },
        {
          userId: userId, 
          check: true, 
          "template.todo": true,
          setting: null,
          tasks: { $eq: [] }
        },
        {
          userId: userId, 
          check: true, 
          setting: { $ne: null },
          tasks: { $ne: [] },
        }
      ]
    });

    res.status(200).json({ ...results, message: "Success deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

module.exports = clearFinished;
