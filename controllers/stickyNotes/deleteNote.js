const mongoose = require('mongoose');
const StickyNotes = require('../../models/stickyNote');

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "invalid note id" });
    }

    const deletedNote = await StickyNotes.deleteOne({ _id: id, userId: req.user?._id });

    if (deletedNote.deletedCount === 1)
      res.status(200).json({ message: "Deleted Succesfully", deletedId: id });
    else res.status(404).json({ message: "Not found note" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.messsage });
  }
}

module.exports = deleteNote;
