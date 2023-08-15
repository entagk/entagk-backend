const { default: mongoose } = require('mongoose');
const ActiveDay = require('../../models/active');
const Task = require('../../models/task');

/**
 * res.body: 
 * {
 *   activeTask: string,
 *   time: {
 *     start: number,
 *     end: number,
 *   }
 * }
 */
const addActivity = async (req, res) => {
  try {
    const { activeTask, time } = req.body;

    // validate body data
    // 1. validate task data
    if (!mongoose.Types.ObjectId.isValid(activeTask) && activeTask) res.status(400).json({ message: 'The active task id is not vaild.' });

    const taskData = await Task.findById(activeTask);

    if (!taskData && activeTask) res.status(400).json({ message: "Invalid task" });

    // 2. validate time data
    if (!time.start || time.start < 0) res.status(400).json({ message: "Invalid start time" });
    if (!time.end || time.end < 0) res.status(400).json({ message: "Invalid end time" });

    const activeDay = new Date().toJSON().split('T')[0];
    const totalMins = (time.end - time.start) / 1000 / 60;
    const day = await ActiveDay.findOne({
      day: activeDay,
      userId: req.user._id.toString()
    });

    if (day) {
      const dayTypes = day.types;
      const dayTemplates = day.templates;
      const dayTasks = day.tasks;
      day.totalMins = day.totalMins + totalMins;

      if (activeTask) {
        const oldTask = dayTasks.filter(t => t.id === activeTask)[0] || { name: taskData.name, id: activeTask };
        oldTask.totalMins = oldTask?.totalMins ? totalMins + oldTask?.totalMins : totalMins;
        day.tasks = oldTask.name ? [...dayTasks.filter(t => t.id !== activeTask), oldTask] : dayTasks;

        if (taskData?.type) {
          const oldType = dayTypes.filter(t => t.name === taskData?.type)[0] || { name: taskData?.type };
          oldType.totalMins = oldType?.totalMins ? totalMins + oldType?.totalMins : totalMins;

          day.types = oldType.name ? [...dayTypes.filter(t => t.name !== oldType.name), oldType] : dayTypes;
        }

        if (taskData?.template?.todo) {
          const templateData = await Task.findById(taskData?.template?._id);

          const oldTemplate =
            dayTemplates.filter(t => t.id === taskData?.template?._id)[0] ||
            { id: taskData.template?._id, name: templateData.name };
          oldTemplate.totalMins = oldTemplate?.totalMins ? totalMins + oldTemplate?.totalMins : totalMins;

          day.templates = oldTemplate.name ? [...day.templates.filter(t => t.id !== taskData?.template?._id), oldTemplate] : dayTemplates;
        }
      }

      const updateDay = await ActiveDay.findByIdAndUpdate(day._id, day, { new: true });

      res.status(200).json(updateDay)
    } else {
      if (activeTask) {
        const newTypes = taskData?.type ? [{ name: taskData?.type, totalMins }] : [];
        const newTasks = taskData?.name ? [{ id: taskData?._id, name: taskData.name, totalMins }] : [];
        const newTemplates = taskData?.template?.todo ? [{ id: taskData?.template?._id, name: await Task.findById(taskData?.template?._id).name, totalMins }] : [];

        const newDay = await ActiveDay.create({
          types: newTypes,
          tasks: newTasks,
          templates: newTemplates,
          userId: req.user?._id.toString(),
          totalMins
        });

        res.status(200).json(newDay)
      } else {
        const newDay = await ActiveDay.create({
          userId: req.user?._id.toString(),
          totalMins
        });

        res.status(200).json(newDay)
      }
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = addActivity;
