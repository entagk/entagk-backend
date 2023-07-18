const Template = require("../../models/template");

const getAll = async (req, res) => {
  const { search, sort, page } = req.query || { search: "", sort: "updatedAt", page: 1 };
  try {
    const limit = 25;
    const startIndex = (Number(page) - 1) * limit;

    const keys = search?.trim()?.split(" ").map(e => new RegExp(e, 'gi'));

    const total = await Template.countDocuments({ $or: [{ name: { $in: keys } }, { desc: { $in: keys } }], visibility: { $eq: true } });
    const templates = await Template.find({ $or: [{ name: { $in: keys } }, { desc: { $in: keys } }], visibility: { $eq: true } }).sort({ [sort]: 1 }).limit(limit).skip(startIndex);

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
