const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./../models/user.js");
const Tasks = require("./../models/task.js");
const sendMail = require("./sendMail.js");
const Setting = require("../models/setting.js");

dotenv.config();

const CLIENT_URL = process.env.CLIENT_URL;

const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

const createAcessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "16h" });
};

const createRefrishToken = (payload) => {
  return jwt.sign(payload, process.env.REFRISH_TOKEN_SECRET, { expiresIn: "7d" })
}

const UserController = {
  signUp: async (req, res) => {
    const { name, email, password, avatar } = req.body;

    try {
      if (!name || !email || !password) {
        res.status(400).json({ message: "Please enter all data fields" });
      }

      if (!validateEmail(email)) {
        res.status(400).json({ message: 'This email is invalid' });
      }

      const oldUser = await User.findOne({ email });
      if (oldUser) return res.status(400).json({ message: "This email already exists" });

      if (password.length < 8) res.status(400).json({ message: 'The password must be at least 8 letters and numbers' });

      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = { email, password: hashedPassword, name, avatar };
      const result = await User.create(newUser);

      await Setting.create({ userId: result._id });

      const token = createAcessToken({ email: newUser.email, id: result._id });

      res.status(200).json({ token, message: "You are logged in successfully" })
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.log(error);
    }
  },

  signIn: async (req, res) => {
    const { email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });

      if (!existingUser) return res.status(404).json({ message: "user not found" });

      const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordCorrect) return res.status(400).json({ message: "wrong password" });

      const token = createAcessToken({ email: existingUser.email, id: existingUser._id });

      res.status(200).json({ token, message: "You are logged in successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getUser: async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.userId)) return res.status(400).json({ message: "No user with this id" });
      const user = await User.findById(req.userId).select("-password");

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      const user = User.findOne({ email });

      if (!user) return res.status(400).json({ message: "This email is not found" });

      const token = createAcessToken({ id: user._id });
      const resetUrl = `${CLIENT_URL}/reset/${token}`;

      sendMail(
        email,
        resetUrl,
        user.name,
        "reset the password",
        "click the link for reseting the password"
      ).catch((error) => {
        console.log(error.message);
        res.status(500).json({ message: error.message });
      });

      res.status(200).json({ message: "checkout your email." });
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { password } = req.body;
      const passwordHash = await bcrypt.hash(password, 12);

      await User.findOneAndUpdate(
        { _id: req.userId },
        {
          password: passwordHash,
        }
      );

      res.json({ message: "The password is changed successfuly." });
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },

  updateUser: async (req, res) => {
    try {
      const { name, avatar, oldPassword, newPassword } = req.body;

      const oldUser = await User.findOne({ _id: req.userId });

      let newUser;

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
          avatar,
          password: passwordHash
        });

      } else {
        newUser = Object.assign(oldUser, { name, avatar });
      }

      const afterUpdatae = await User.findByIdAndUpdate(req.userId, newUser, {
        new: true,
      })

      res.status(200).json({ message: "Successfuly updates", afterUpdatae });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteAccount: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.userId);

      await Tasks.deleteMany({ userId: req.userId });
      await Setting.deleteOne({ userId: req.userId });

      res
        .status(200)
        .json({ message: "تم حذف الحساب بنجاح", deleted_id: user.id });
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.log(error);
    }
  },
}

module.exports = UserController;