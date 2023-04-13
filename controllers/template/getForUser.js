const Template = require("../../models/template");

const getForUser = async (req, res) => { // get templates not at todo list
  const { page } = req.query || 1;
  try {
    const limit = 25;
    const startIndex = (Number(page) - 1) * limit;

    const total = await Template.countDocuments({ userId: req.user._id.toString(), todo: { $eq: null } }); // Template.find({ userId: req.user._id.toString() });
    const templates = await Template.find({ userId: req.user._id.toString(), todo: { $eq: null } }).limit(limit).skip(startIndex);

    res.status(200).json({
      templates,
      total,
      currentPage: page ? Number(page) : total === 0 ? 0 : 1,
      numberOfPages: Math.ceil(total / limit)
    });

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

module.exports = getForUser;
