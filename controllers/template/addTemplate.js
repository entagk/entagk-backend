const Template = require("../../models/template");
const Task = require("../../models/task");
const { filterBody } = require("../../utils/helper.js");

const addTemplate = async (req, res) => {
  try {
    const props = `
      name,
      visibility,
      desc,
      tasks,
      iconURL,
      color,
      time,
      timeForAll,
      autoBreaks,
      autoPomodors,
      autoStartNextTask,
      longInterval,
      alarmType,
      alarmVolume,
      alarmRepet,
      tickingType,
      tickingVolume`;
    const body = filterBody(props.split(",").map(e => e.trim()), req.body);

    const templateData = await Template.create({
      userId: req.user._id.toString(),
      ...body
    });

    let est = 0;
    for (let index = 0; index < body.tasks.length; index++) {
      const task = body.tasks[index];
      if (!task.order) task.order = index;
      task.template = { _id: templateData._id.toString(), todo: false };
      task.userId = req.user._id.toString();
      est += task.est;
    }

    const tasksIdsData = await Task.insertMany(body.tasks);

    const tasksIds = tasksIdsData.map(task => task._id);

    const updateTemplate = await Template.findByIdAndUpdate(templateData._id, { tasks: tasksIds, est: est }, { new: true });

    res.status(200).json(updateTemplate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = addTemplate;
