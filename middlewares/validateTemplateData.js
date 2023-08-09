const validateTemplateData = (req, res, next) => {
  try {
    const {
      name,
      desc,
      tasks
    } = req.body;

    if (req._parsedUrl.pathname === '/add/') {
      if (!name?.trim() || !desc?.trim())
        return res.status(400).json({
          errors: !name?.trim() && !desc?.trim() ? {
            name: "This field is required",
            desc: "This field is required"
          } : !desc?.trim() ? {
            est: "This field is required"
          } : {
            name: "This field is required",
          }
        });
    } else {
      if (Object.keys(req.body).length === 0) return res.status(400).json({ message: "Please enter the essential data (eg: name or description) of the template" });
    }

    if (name?.trim()?.length > 50 && name?.trim()) return res.status(400).json({ errors: { name: "The name length is more than 50 characters." } })

    if (desc?.trim()?.length > 500 && desc?.trim()) return res.status(400).json({ errors: { desc: "The description length is more than 500 characters." } })

    if (req._parsedUrl.pathname === '/add/') {
      if (!tasks || tasks.length === 0) return res.status(400).json({ message: "please enter the template tasks." });

      // let est = 0;
      for (let index = 0; index < tasks.length; index++) {
        const task = tasks[index];

        const { name, est, act, notes, project, order } = task;

        if (!name?.trim() || !est)
          return res.status(400).json({
            errors: !name?.trim() && !est ? {
              name: `For task ${index + 1}, This field is required`,
              est: `For task ${index + 1}, This field is required`
            } : !est ? {
              est: `For task ${index + 1}, This field is required`
            } : {
              name: `For task ${index + 1}, This field is required`,
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
      }
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = validateTemplateData;
