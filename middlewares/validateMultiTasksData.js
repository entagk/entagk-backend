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
    if(!Array.isArray(req.body)) return res.status(400).json({message: "The data have been sent is not array, please try again"});
    if (req.body?.length === 0) return res.status(400).json({ message: 'No data have been sent yet.' });

    const tasks = req.body?.map((task) => {
      return { ...task, userId: req.userId };
    });

    for (let index = 0; index < tasks.length; index++) {
      const task = tasks[index];
      const { name, est, act, notes, project, order } = task;

      if (!name?.trim() || !est) return res.status(400).json({ message: `For task ${index + 1}, please complete the task data with at least the name and est` });

      if (est <= 0) return res.status(400).json({ message: `For task ${index + 1}, The est shouldn't be negative number.` });
      if (act < 0 && act) return res.status(400).json({ message: `For task ${index + 1}, The act shouldn't be negative number.` });
      if (name?.length > 50 && name?.trim()) return res.status(400).json({ message: `For task ${index + 1}, The name length is more than 50 characters.` });

      if (notes?.length > 500 && notes?.trim()) return res.status(400).json({ message: `For task ${index + 1}, The notes length is more than 500 characters.` });
      if (order < 0 || !order) task.order = index;

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
