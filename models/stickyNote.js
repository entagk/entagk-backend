const mongoose = require("mongoose");

/**
 * note => {
 *  _id: ObjectId,
 * content: Array,
 * coordinates: Object,
 * position: Object,
 * color: String,
 * open: Boolean,
 *  userId : String,
 *  createdAt: Date,
 *  updatedAt: Date,
 * }
 */

const stickySchema = new mongoose.Schema(
  {
    content: {
      type: Array,
      require: [true, "Please, enter the note content"]
    },
    coordinates: {
      type: Object,
      default: { width: 300, height: 300 }
    },
    position: {
      type: Object,
      default: { top: 6, left: 0 }
    },
    color: {
      type: String,
      default: 'yellow'
    },
    open: {
      type: Boolean,
      default: true
    },
    userId: {
      type: String,
      require: [true, "You should enter the userId."]
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Sticky", stickySchema);
