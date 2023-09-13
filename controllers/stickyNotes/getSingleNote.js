const { default: mongoose } = require("mongoose");
const StickyNote = require("../../models/stickyNote");

const getSingleNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "invalid note id" })
    }

    const note = await StickyNote.findById(id);

    res.status(200).json(note);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = getSingleNote;
