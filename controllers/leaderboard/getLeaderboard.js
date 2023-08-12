const User = require('./../../models/user');

const getLeaderboard = async (req, res) => {
  const page = req.query.page || 1;
  try {
    const limit = 10;
    const startIndex = (Number(page) - 1) * limit;

    const total = await User.countDocuments();
    const users = await User.find().select('-password').sort({ totalHours: -1 }).limit(limit).skip(startIndex);

    res.status(200).json({
      users,
      total,
      currentPage: page ? Number(page) : total === 0 ? 0 : 1,
      numberOfPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message })
  }
}

module.exports = getLeaderboard;
