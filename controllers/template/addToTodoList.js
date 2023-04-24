const Task = require("../../models/task");
const { createObjFromObj } = require('./../../utils/helper');

// const todoTemp = {
//   "_id": "6398878f6786d03ccead1ea9",
//   "name": "First Template",
//   "userId": "638c116425db78b50bcc1c08",
//   "est": 1,
//   "act": 0,
//   "color": "#ef9b0f",
//   "tasks": [
//     "6398878f6786d03ccead1eab",
//     "6398878f6786d03ccead1eac"
//   ],
//   "setting": {
//     "time": {
//       "PERIOD": 1500,
//       "SHORT": 300,
//       "LONG": 900
//     },
//     "timeForAll": true,
//     "autoBreaks": false,
//     "autoPomodors": false,
//     "autoStartNextTask": false,
//     "longInterval": 4,
//     "alarmType": {
//       "name": "alarm 1",
//       "src": "sounds/alarm/1.mp3"
//     },
//     "alarmVolume": 50,
//     "alarmRepet": false,
//     "tickingType": {
//       "name": "tricking 1",
//       "src": "sounds/tricking/1.mp3"
//     },
//     "tickingVolume": 50
//   }
// };

const addToTodoList = async (req, res) => {
  try {
    const { id } = req.params;
    const { order } = req.body;
    const oldTemplate = req.oldTemplate;
    delete oldTemplate._id;
    const setting = createObjFromObj(
      oldTemplate._doc,
      'time,timeForAll,autoBreaks,autoPomodors,autoStartNextTask,longInterval,alarmType,alarmVolume,alarmRepet,tickingType,tickingVolume');

    const templateData = {
      "name": oldTemplate.name,
      "est": oldTemplate.est,
      "act": oldTemplate.act,
      "color": oldTemplate.color,
      "tasks": oldTemplate.tasks,
      "userId": req.user._id.toString(),
      "order": order,
      "setting": setting
    };

    const newTemplate = await Task.create(templateData);

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
          _id: newTemplate._id.toString(),
          todo: true
        }
      }
    });

    const newTasks = await Task.insertMany(tasksData);
    console.log(newTasks);

    const updateTemplate = await Task.findByIdAndUpdate(newTemplate._id, { tasks: newTasks.map((task) => task._id) }, { new: true });

    res.status(200).json(updateTemplate);
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

module.exports = addToTodoList;
