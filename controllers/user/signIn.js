const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("../../models/user.js");

dotenv.config();

const { validateEmail, createAcessToken } = require("../../utils/helper");

const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'This email is invalid' });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) return res.status(404).json({ message: "user not found" });

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "wrong password" });

    const token = createAcessToken({ email: existingUser.email, id: existingUser._id });

    res.status(200).json({ access_token: token, message: "You are logged in successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = signIn;
