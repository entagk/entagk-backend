const Template = require("../../models/template");
const { filterBody } = require("../../utils/helper.js");

const addTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const oldTemplate = req.oldTemplate._doc;

    delete oldTemplate._id;

    const props = `
    name,
    visibility,
    desc,
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

    const templateBody = body;

    const updatedTemplate = await Template.findByIdAndUpdate(id, templateBody, { new: true });

    res.status(200).json(updatedTemplate);
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

module.exports = addTemplate;
