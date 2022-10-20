const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "please enter the task name!"]
    },
    est: {
      type: Number,
      require: [true, "please enter the est pomodoro"],
      default: 1,
    },
    act: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: "",
    },
    project: {
      type: String,
      default: "",
    },
    check: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      require: [true, "You should enter the userId."]
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);