const StickyNotes = require('../../models/stickyNote');

const getNotes = async (req, res) => {
  try {
    const user = req.user,
      page = req.query.page || 1,
      limit = 25,
      startIndex = (Number(page) - 1) * limit;

    const total = await StickyNotes.countDocuments({ userId: user._id });
    const notes = await StickyNotes.find(
      { userId: user._id, open: false },
      { // this projection for getting one element at content array.
        content: { $slice: 1 },
      }
    )
      .sort({ updatedAt: -1 })
      .limit(limit)
      .skip(startIndex);

    res.status(200).json({
      notes,
      currentPage: page,
      numberOfPages: Math.ceil(total / limit),
      total: total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = getNotes;
