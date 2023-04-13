const mongoose = require("mongoose");

const User = require("../../models/user.js");

const getUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.user._id.toString())) return res.status(400).json({ message: "No user with this id" });
    const user = await User.findById(req.user._id.toString()).select("-password");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = getUser;
