const bcrypt = require("bcryptjs");

const User = require("../../models/user.js");

const updateUser = async (req, res) => {
  try {
    const { name, oldPassword, newPassword } = req.body;

    if (!name && (!oldPassword && !newPassword)) return res.status(400).json({ message: "Please enter the new data" });

    const oldUser = await User.findOne({ _id: req.user._id.toString() });

    if (!oldUser) return res.status(404).json({ message: "This user is not found" });

    let newUser = oldUser;

    if (newPassword) {
      const isPasswordCorrect = await bcrypt.compare(
        oldPassword,
        oldUser.password
      );

      if (!isPasswordCorrect) return res.status(400).json({ message: "The old password does not match." });

      if (newPassword.length < 8) {
        res.status(400).json({ message: "The password shouldn't be less than 8 letter or numbers" })
      }

      const passwordHash = await bcrypt.hash(newPassword, 12);
      newUser = Object.assign(oldUser, {
        name,
        password: passwordHash
      });

    } else {
      newUser = Object.assign(oldUser, { name });
    }

    const afterUpdatae = await User.findByIdAndUpdate(req.user._id.toString(), newUser, {
      new: true,
    })

    res.status(200).json({ message: "Successfuly updates", afterUpdatae });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = updateUser;
