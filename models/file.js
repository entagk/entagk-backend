const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'please enter the file name'],
    trim: true,
  },
  size: {
    type: Number,
    require: [true, "please enter the file size in bytes"],
  },
  path: {
    type: String,
    require: [true, 'please enter the file path'],
    trim: true,
  },
  type: {
    type: String,
    require: [true, 'please enter the file type'],
    trim: true
  },
  userId: {
    type: String,
    require: [true, 'please enter the userId'],
    trim: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("File", fileSchema);;
