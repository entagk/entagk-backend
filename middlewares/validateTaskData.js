const Template = require("../models/template");
const Task = require("../models/task");
const mongoose = require("mongoose");

const validateTaskData = async (req, res, next) => {
  try {
    const { name, est, act, notes, project, order, template } = req.body;
    if (req._parsedUrl.pathname === '/add/') {
      if (!name?.trim() || !est) return res.status(400).json({
        errors: {
          name: "This field is required",
          est: "This field is required"
        }
      });
    } else {
      // updateTask
      if (!name && !est && !act && !notes && !project) return res.status(400).json({ message: "Please enter the data that you want to update the task to it." })
    }

    if (est <= 0)
      return res.status(400).json({
        errors: {
          est: "The est shouldn't be negative number."
        }
      });
    if (name?.length > 50 && name?.trim())
      return res.status(400).json({
        errors: {
          name: "The name length is more than 50 characters."
        }
      });

    if (notes?.length > 500 && notes?.trim())
      return res.status(400).json({
        errors: {
          notes: "The notes length is more than 500 characters."
        }
      })

    const templateData = await Template.findById(template?._id) || await Task.findById(template?._id);
    console.log(templateData);
    if (template) {
      console.log(!templateData?._id);
      console.log(!mongoose.Types.ObjectId.isValid(template?._id))
      console.log(templateData === null)
      if (!templateData?._id || !mongoose.Types.ObjectId.isValid(template?._id) || templateData === null) return res.status(400).json({ message: "Invalid template" });
      else {
        template.todo = templateData?.template === null;
      }
    }

    // updateTask
    if (req._parsedUrl.pathname !== '/add/') {
      if (act < 0)
        return res.status(400).json({
          errors: {
            act: "The act shouldn't be negative number."
          }
        });
    }

    // for useing at task.js
    req.templateData = templateData;
    req.body.template = template;

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = validateTaskData;
