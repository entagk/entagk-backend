const Template = require("../../models/template");

const getAll = async (req, res) => {
  const { page, sort } = req.query || { page: 1, sort: 'updatedAt'};
  try {
    const limit = 25;
    const startIndex = (Number(page) - 1) * limit;

    const total = await Template.countDocuments({ visibility: { $eq: true } });
    const templates = await Template.find({ visibility: { $eq: true } }).sort({ [sort]: 1 }).limit(limit).skip(startIndex);

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

module.exports = getAll;
