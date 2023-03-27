const Template = require('../../models/template.js');

const searchTemplates = async (req, res) => {
  try {
    const { search, visibility } = req.query;
    const { page } = req.query || 1;
    const limit = 25;
    const startIndex = (Number(page) - 1) * limit;

    if (search.trim() === 0) return res.status(400).json({ message: "no search query, try again please" });

    const keys = search.split(" ").map(e => new RegExp(e));

    let total, templates;
    if(req.userId) {
      total = await Template.countDocuments({ $or: [{ name: { $in: keys } }, { description: { $in: keys } }], userId: req.userId, visibility: Boolean(visibility) });
      templates = await Template.find({ $or: [{ name: { $in: keys } }, { description: { $in: keys } }], userId: req.userId }).limit(limit).skip(startIndex);
    } else {
      total = await Template.countDocuments({ $or: [{ name: { $in: keys } }, { description: { $in: keys } }], visibility: true });
      templates = await Template.find({ $or: [{ name: { $in: keys } }, { description: { $in: keys } }], visibility: true }).limit(limit).skip(startIndex);
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
