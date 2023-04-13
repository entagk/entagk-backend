const dotenv = require("dotenv");

const User = require("../../models/user.js");

const { createRefrishToken } = require("../../utils/helper");

dotenv.config();

const getRefreshToken = async (req, res) => {
  try {
    const existingUser = await User.findById(req.user._id.toString());
    const token = createRefrishToken({ email: existingUser.email, id: existingUser._id });

    res.status(200).json({ refresh_token: token, message: "You are logged in successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

module.exports = getRefreshToken;
