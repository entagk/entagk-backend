const { default: mongoose } = require('mongoose');
const ActiveDay = require('../../models/active');
const User = require('../../models/user');
const Task = require('../../models/task');

const updateUser = async (oldDay, user, totalMins) => {
  await User.findByIdAndUpdate(
    user._id,
    {
      totalFocusDay: !oldDay ? user.totalFocusDay + 1 : user.totalFocusDay,
      totalActiveDay: !oldDay ? user.totalActiveDay + 1 : user.totalActiveDay,
      totalHours: user.totalHours + (totalMins / 60)
    },
    {
      new: true
    }
  )
}

const updateActiveDay = async (day, activeTask, taskData, user, totalMins) => {
  const dayData = await ActiveDay.findOne({
    day: day,
    userId: user._id.toString()
  });

  if (dayData) {
    const dayTypes = dayData.types;
    const dayTemplates = dayData.templates;
    const dayTasks = dayData.tasks;
    dayData.totalMins = dayData.totalMins + totalMins;

    if (activeTask) {
      const oldTask = dayTasks.filter(t => t.id === activeTask)[0] || { name: taskData.name, id: activeTask, type: taskData?.type };
      oldTask.totalMins = oldTask?.totalMins ? totalMins + oldTask?.totalMins : totalMins;
      dayData.tasks = [...dayTasks.filter(t => t.id !== activeTask), oldTask];

      if (taskData?.type) {
        const oldType = dayTypes.filter(t => t?.typeData?.name === taskData?.type.name)[0] || { typeData: taskData?.type };
        oldType.totalMins = oldType?.totalMins ? totalMins + oldType?.totalMins : totalMins;

        dayData.types = [...dayTypes.filter(t => t?.typeData?.name !== oldType.typeData.name), oldType];
      }

      if (taskData?.template?.todo) {
        const templateData = await Task.findById(taskData?.template?._id);

        const oldTemplate =
          dayTemplates.filter(t => t.id === taskData?.template?._id)[0] ||
          { id: taskData.template?._id.toString(), name: templateData.name };
        oldTemplate.totalMins = oldTemplate?.totalMins ? totalMins + oldTemplate?.totalMins : totalMins;

        dayData.templates = [...dayData.templates.filter(t => t.id !== taskData?.template?._id.toString()), oldTemplate];
      }
    }

    const updateDay = await ActiveDay.findByIdAndUpdate(dayData._id, dayData, { new: true });

    await updateUser(true, user, totalMins)

    return updateDay;
  } else {
    if (activeTask) {
      const newTypes = taskData?.type ? [{ typeData: taskData?.type, totalMins }] : [];
      const newTasks = taskData?.name ? [{ id: taskData?._id.toString(), name: taskData.name, totalMins, type: taskData?.type }] : [];
      const newTemplates = taskData?.template?.todo ?
        [{
          id: taskData?.template?._id.toString(),
          name: await Task.findById(taskData?.template?._id).name,
          totalMins
        }] : [];

      const newDay = await ActiveDay.create({
        types: newTypes,
        tasks: newTasks,
        templates: newTemplates,
        userId: user?._id.toString(),
        totalMins,
        day: day,
      });

      await updateUser(false, user, totalMins)

      return newDay;
    } else {
      const newDay = await ActiveDay.create({
        userId: user?._id.toString(),
        totalMins,
        day: day,
        types: [{ typeData: { name: "Nothing", code: "1F6AB" }, totalMins }]
      });

      await updateUser(false, user, totalMins)

      return newDay;
    }
  }
}

const endOfDay = (day) => {
  const dayDate = new Date(day);

  const endOfDay = new Date(dayDate);
  endOfDay.setHours(24, 0, 0, 0);

  return endOfDay.getTime();
}

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

    if (!activeTask && !time)
      return res.status(400).json({ message: "Please, enter the active data" })

    // validate body data
    // 1. validate task data
    if (!mongoose.Types.ObjectId.isValid(activeTask) && activeTask)
      return res.status(400).json({ message: 'The active task id is not vaild.' });

    const taskData = await Task.findById(activeTask);

    if (!taskData && activeTask)
      return res.status(400).json({ message: "Invalid task" });

    // 2. validate time data
    if (!time.start || time.start < 0)
      return res.status(400).json({ message: "Invalid start time" });
    if (!time.end || time.end < 0)
      return res.status(400).json({ message: "Invalid end time" });
    if (time.end - time.start > (60 * 60 * 1000))
      return res.status(400).json({ message: "Invalid activity" });

    const startDay = new Date(time.start).toJSON().split('T')[0];
    const endDay = `${new Date(time.end).getFullYear()}-${new Date(time.end).getMonth() + 1}-${new Date(time.end).getDate() > 10 ? new Date(time.end).getDate() : '0' + new Date(time.end).getDate()}`;

    const totalMins = (time.end - time.start) / 1000 / 60;

    if (startDay === endDay) {
      const updatedActiveDay = await updateActiveDay(startDay, activeTask, taskData, req.user, totalMins);
      res.status(200).json(updatedActiveDay);
    } else {
      const totalMinsAtStart = (endOfDay(startDay) - time.start) / 1000 / 60;

      await updateActiveDay(startDay, activeTask, taskData, req.user, totalMinsAtStart);
      const totalMinsAtEnd = (time.end - endOfDay(startDay)) / 1000 / 60;

      const updatedDay = await updateActiveDay(endDay, activeTask, taskData, req.user, totalMinsAtEnd);
      res.status(200).json(updatedDay)
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = addActivity;
