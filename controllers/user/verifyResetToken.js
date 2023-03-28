const User = require("../../models/user.js");

const verifyResetToken = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (user.email) {
      res.status(200).json({ verify: true, message: "Founded user." })
    } else {
      res.status(404).json({ verify: false, message: "Sorry, this user is not found." })
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = verifyResetToken;
