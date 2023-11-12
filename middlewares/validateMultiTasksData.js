const { types } = require('../utils/helper')
/**
 * [
    {
        "_id": "c8PHJh6yOTf_JV9zoVb9O",
        "est": 3,
        "name": "tasks 2",
        "act": 0,
        "notes": "",
        "project": "",
        "check": false
    },
    {
        "_id": "CPHeA73Pij_XmBO6PtDbk",
        "name": "FDSF fad saf fdsafas",
        "est": 3,
        "notes": "",
        "project": "",
        "check": false
    },
    {
        "_id": "Kjk6Gu3z5kx5N9aLD6xmZ",
        "name": "mohamed_ali",
        "est": 4,
        "act": 0,
        "notes": "dfs djfs jaf fda fdks as ffk sajfasfasf afaksjfas safkjf daf as asdjf af ksaj fkajf as fj asjjfas jddfs djfs jaf fda fdks as ffk sajfasfasf afaksjfas safkjf daf as asdjf af ksaj fkajf as fj asjjfas jddfs djfs jaf fda fdks as ffk sajfasfasf afaksjfas safkjf daf as asdjf af ksaj fkajf as fj asjjfas jddfs djfs jaf fda fdks as ffk sajfasfasf afaksjfas safkjf daf as asdjf af ksaj fkajf as fj asjjfas jddfs djfs jaf fda fdks as ffk sajfasfasf afaksjfas safkjf daf as asdjf af ksaj fkajf as fj asjjfas jd",
        "project": "",
        "check": false
    }
  ]
 */

const ValidateMultiTasksData = async (req, res, next) => {
  try {
    if (!Array.isArray(req.body)) return res.status(400).json({ message: "The data have been sent is not array, please try again" });
    if (req.body?.length === 0) return res.status(400).json({ message: 'No data have been sent yet.' });

    const tasks = req.body?.map((task) => {
      return { ...task, userId: req.user._id.toString() };
    });

    for (let index = 0; index < tasks.length; index++) {
      const task = tasks[index];
      const { name, est, act, notes, project, order, type } = task;

      if (!name?.trim() || !est)
        return res.status(400).json({
          errors: !name?.trim() ? {
            name: `For task ${index + 1}, This field is required`,
          } : !est ? {
            est: `For task ${index + 1}, This field is required`
          } : {
            name: `For task ${index + 1}, This field is required`,
            est: `For task ${index + 1}, This field is required`
          }
        });

      if (est <= 0)
        return res.status(400).json({
          errors: {
            est: `For task ${index + 1}, The est shouldn't be negative number.`
          }
        });

      if (act < 0 && act)
        return res.status(400).json({
          errors: {
            act: `For task ${index + 1}, The act shouldn't be negative number.`
          }
        });

      if (name?.length > 50 && name?.trim())
        return res.status(400).json({
          errors: {
            name: `For task ${index + 1}, The name length is more than 50 characters.`
          }
        });

      if (notes?.length > 500 && notes?.trim())
        return res.status(400).json({
          errors: {
            notes: `For task ${index + 1}, The notes length is more than 500 characters.`
          }
        });

      if (order < 0 || !order) task.order = index;

      // fix it if you want to give the user ability of adding other type
      if (type && !types.find(t => t.name === type.name && t.code === type.code)) {
        return res.status(400).json({
          message: "Invalid task type"
        });
      }

      delete task?._id;
    }

    req.body = tasks;

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = ValidateMultiTasksData;  
