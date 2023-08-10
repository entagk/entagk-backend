const bcrypt = require("bcryptjs");
const User = require("../../models/user.js");

const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 8)
      return res.status(400).json({
        errors: {
          password: "Please, enter a valid new password."
        }
      });

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.findById(req.userId);
    if (!user)
      return req.status(404).json({ message: "Not found user." });

    await User.findOneAndUpdate(
      { _id: req.userId },
      {
        password: passwordHash,
      }
    );

    res.status(200).json({ message: "The password is changed successfuly." });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

module.exports = resetPassword;
