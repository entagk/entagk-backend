const Template = require("../../models/template");
const Task = require("../../models/task");

const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const oldTemplate = req.oldTemplate._doc;
    console.log(oldTemplate);

    const deletedTemplate = await Template.findByIdAndDelete(oldTemplate._id);

    const deletedTasks = await Task.deleteMany({ template: { _id: id, todo: oldTemplate.todo !== null } });
    res.status(200).json({ deletedTemplate, deletedTasks });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

module.exports = deleteTemplate;
