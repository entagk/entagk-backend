const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "please enter your name!"],
      trim: true,
    },
    email: {
      type: String,
      require: [true, "please enter your name!"],
      trim: true,
    },
    password: {
      type: String,
      require: [true, "please enter your password!"],
    },
    avatar: {
      type: String,
      trim: true,
    },
  },
  {
    timeseries: true,
  }
);

module.exports = mongoose.model("User", userSchema);