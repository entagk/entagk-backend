const StickyNotes = require('../../models/stickyNote');

const getOpenedNotes = async (req, res) => {
  try {
    const user = req.user;

    const totalNotes = await StickyNotes.countDocuments(
      { userId: user._id }
    );
    const totalOpenedNotes = await StickyNotes.countDocuments(
      { userId: user._id, open: { $eq: true } }
    );
    const requiredNotes = await StickyNotes.find(
      { userId: user._id, open: { $eq: true } },
      { // this projection for getting one element at content array.
        content: { $slice: 1 },
      }
    );

    res.status(200).json({ total: totalNotes, totalOpenedNotes: totalOpenedNotes, notes: requiredNotes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = getOpenedNotes;
