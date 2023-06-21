const Task = require("../../models/task.js");

/*
  Delete any task which is not belong to template, 
  if the task belong to todo template delete it if the template is checked.
 */

const clearFinished = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const todoTemp = await Task.find({
      userId: userId,
      template: null,
      check: true,
      setting: { $ne: null },
      tasks: { $ne: [] },
    }).select("_id");
    
    console.log(todoTemp.map(t => t._id.toString()));

    const tempTasks = await Task.deleteMany({
      "template._id": { $in: todoTemp.map(t => t._id.toString()) }
    });
    
    console.log(tempTasks, todoTemp);
    
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
          template: null,
          check: true,
          setting: { $ne: null },
          tasks: { $ne: [] }
        }
      ]
    });

    console.log(results);

    res.status(200).json({ ...results, message: "Success deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

module.exports = clearFinished;
