const Template = require("../../models/template");
const Task = require("../../models/task");

const addToTodoList =  async (req, res) => {
  try {
    const { id } = req.params;
    const { order } = req.body;
    const oldTemplate = req.oldTemplate._doc;
    delete oldTemplate._id;

    const templateData = Object.assign(oldTemplate, {
      userId: req.user._id.toString(),
      todo: {
        userId: req.user._id.toString(),
        order: order ? order : 0,
      },
      visibility: false
    });

    const newTemplate = await Template.create(templateData);

    const oldTasks = await Task.find({ template: { _id: id, todo: false } });
    console.log(oldTasks);
    const tasksData = oldTasks.map(({ _doc: task }) => {
      delete task._id;
      delete task.createdAt;
      delete task.updatedAt;
      return {
        ...task,
        userId: req.user._id.toString(),
        template: {
          _id: newTemplate._id,
          todo: true
        }
      }
    });

    const newTasks = await Task.insertMany(tasksData);
    console.log(newTasks);

    const updateTemplate = await Template.findByIdAndUpdate(newTemplate._id, { tasks: newTasks.map((task) => task._id) }, { new: true });

    res.status(200).json(updateTemplate);
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

module.exports = addToTodoList;
