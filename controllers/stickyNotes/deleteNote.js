const mongoose = require('mongoose');
const StickyNotes = require('../../models/stickyNote');

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "invalid note id" });
    }

    await StickyNotes.deleteOne({ _id: id, userId: req.user?._id });

    res.status(200).json({ message: "Deleted Succesfully", deletedId: id });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.messsage });
  }
}

module.exports = deleteNote;
