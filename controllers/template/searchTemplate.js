const Template = require('../../models/template.js');

const searchTemplates = async (req, res) => {
  try {
    const { search, sort, page } = req.query || { search: "", sort: "updatedAt", page: 1 };
    console.log(search);
    console.log(sort);
    console.log(page);
    const limit = 25;
    const startIndex = (Number(page) - 1) * limit;

    if (search.trim().length === 0) return res.status(400).json({ message: "no search query, try again please" });

    const keys = search.split(" ").map(e => new RegExp(e, 'gi'));

    let total, templates;
    if (req?.user?._id?.toString()) {
      total = await Template.countDocuments({ $or: [{ name: { $in: keys } }, { desc: { $in: keys } }], userId: req?.user?._id?.toString() });
      templates = await Template.find({ $or: [{ name: { $in: keys } }, { desc: { $in: keys } }], userId: req?.user?._id?.toString() }).sort({ [sort]: 1 }).limit(limit).skip(startIndex);
    } else {
      total = await Template.countDocuments({ $or: [{ name: { $in: keys } }, { desc: { $in: keys } }], visibility: true });
      templates = await Template.find({ $or: [{ name: { $in: keys } }, { desc: { $in: keys } }], visibility: true }).sort({ [sort]: 1 }).limit(limit).skip(startIndex);
    }

    res
      .status(200)
      .json({
        templates,
        total,
        currentPage: page ? Number(page) : total === 0 ? 0 : 1,
        numberOfPages: Math.ceil(total / limit)
      });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = searchTemplates;
