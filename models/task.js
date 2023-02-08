const mongoose = require("mongoose");

/**
 * task => {
 *  _id: ObjectId,
 *  userId : String,
 *  name: String,
 *  est: Number,
 *  act: Number,
 *  check: Boolean,
 *  notes: String,
 *  createdAt: Date,
 *  updatedAt: Date,
 *  order: Number,
 *  template: {
 *    _id: ObjectId(templateId),
 *    todo: false
 *  },
 *  taskClone: "",
 * }
 */

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
    order: {
      type: Number,
      require: [true, "Please enter the order of the task"]
    },
    template: {
      type: Object,
      default: null
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