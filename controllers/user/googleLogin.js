const { google } = require('googleapis');

const { createAcessToken } = require("../../utils/helper");

const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("../../models/user.js");
const Setting = require("../../models/timerGeneralSetting.js");

dotenv.config();

const { OAuth2 } = google.auth;
const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID);

const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const verify = await client.verifyIdToken({ idToken: token, audience: process.env.MAILING_SERVICE_CLIENT_ID })

    const { email_verified, email, name, picture } = verify.getPayload();

    if (!email_verified) return res.status(400).json({ message: "This email is not verify, verify it and try again later." });

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      const token = createAcessToken({ email: oldUser.email, id: oldUser._id });

      res.status(200).json({ message: 'Successful Login.', access_token: token });
    } else {
      const password = email + process.env.GOOGLE_SECRET;
      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = await User.create({
        name, email, password: hashedPassword, avatar: picture
      });

      await Setting.create({ userId: newUser._id });

      const token = createAcessToken({ email: newUser.email, id: newUser._id });

      res.status(200).json({ message: 'Successful Login', access_token: token });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

module.exports = googleLogin;
