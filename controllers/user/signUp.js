const User = require('../../models/user');

const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const Setting = require("../../models/timerGeneralSetting.js"); //

const { validateEmail, createAcessToken } = require("../../utils/helper");

dotenv.config();

const signUp = async (req, res) => {
  const { name, email, password, avatar } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter all data fields" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ errors: { email: 'This email is invalid' } });
    }

    const oldUser = await User.findOne({ email });
    if (oldUser) return res.status(400).json({ message: "This email already exists" });

    if (password.length < 8)
      return res.status(400).json({
        errors: {
          password: 'The password must be at least 8 letters and numbers'
        }
      });

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = { email, password: hashedPassword, name, avatar };
    const result = await User.create(newUser);

    await Setting.create({ userId: result._id });

    const token = createAcessToken({ email: newUser.email, id: result._id });

    res.status(200).json({ access_token: token, message: "You are logged in successfully" })
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = signUp;
