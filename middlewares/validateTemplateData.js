const validateTemplateData = (req, res, next) => {
  try {
    const {
      name,
      desc,
      tasks
    } = req.body;
    console.log(req.body);

    if (req._parsedUrl.pathname === '/add/') {
      if (!name?.trim() && !desc) return res.status(400).json({ message: "Please enter the essential data (eg: name or description) of the template" });
    } else {
      if (Object.keys(req.body).length === 0) return res.status(400).json({ message: "Please enter the essential data (eg: name or description) of the template" });
    }

    if (name?.trim()?.length > 50 && name?.trim()) return res.status(400).json({ message: "The name length is more than 50 characters." })

    if (desc?.trim()?.length > 500 && desc?.trim()) return res.status(400).json({ message: "The description length is more than 500 characters." })

    if (req._parsedUrl.pathname === '/add/') {
      if (!tasks || tasks.length === 0) return res.status(400).json({ message: "please enter the template tasks." });

      // let est = 0;
      for (let index = 0; index < tasks.length; index++) {
        const task = tasks[index];

        if (!task.name?.trim() || !task.est) return res.status(400).json({ message: "Please, complete the task data at least name and est" });

        if (task.est <= 0) return res.status(400).json({ message: "The est shouldn't be negative number." });

        if (task.name?.length > 50 && task.name?.trim()) return res.status(400).json({ message: "The name length is more than 50 characters." });

        if (task.notes?.length > 500 && task.notes?.trim()) return res.status(400).json({ message: "The notes length is more than 50 characters." });
      }
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = validateTemplateData;