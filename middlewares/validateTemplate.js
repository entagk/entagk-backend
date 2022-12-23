const mongoose = require("mongoose");
const Template = require('./../models/template');

const validateTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });

    const oldTemplate = await Template.findById(id);
    console.log(req.path);

    if (!oldTemplate?._id) return res.status(404).json({ message: "This template doesn't found." });

    if (oldTemplate?.userId !== req?.userId) {
      if (!oldTemplate?.visibility) return res.status(405).json({ message: "Not allow for you." });
    }

    delete oldTemplate._id;
    req.oldTemplate = { ...oldTemplate };
    console.log(req.oldTemplate);
    next();

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = validateTemplate;