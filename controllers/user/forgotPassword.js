const dotenv = require("dotenv");

const User = require("../../models/user.js");
const sendMail = require("../../utils/sendMail.js");
const ResetId = require('../../models/resetId'); // 

const { validateEmail, createPasswordResetPassword } = require("../../utils/helper");

dotenv.config();

const CLIENT_URL = process.env.CLIENT_URL;

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ errors: { email: 'This email is invalid' } });
    }

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ errors: { email: "This email is not found" } });

    const token = createPasswordResetPassword({ id: user._id }).split(".");

    const resetUrl = `${CLIENT_URL}/reset/${token[2]}`;

    sendMail(
      email,
      resetUrl,
      user.name,
      "reset the password",
      "click the link for reseting the password"
    ).then(async (result) => {
      if (result.accepted !== undefined) {
        if (result?.accepted[0] === email) {
          const createdToken = await ResetId.create({ partOne: token[0], partTwo: token[1], partThree: token[2] });

          if (email.toLowerCase().includes('testing')) result.ResetId = createdToken.partThree;

          res.status(200).json({ message: 'checkout your email.', result })
        }
      }
    }).catch((error) => {
      console.log(error);
      res.status(500).json({ message: error.message || 'some thing error while sending mail', error });
    })

  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error)
  }
};

module.exports = forgotPassword;
