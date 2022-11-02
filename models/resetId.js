const mongoose = require('mongoose');

const resetIdSchema = new mongoose.Schema(
  {
    partOne: {
      type: String,
      require: [true, 'please enter the part1'],
      trim: true,
    },
    partTwo: {
      type: String,
      require: [true, 'please enter the part2'],
      trim: true,
    },
    partThree: {
      type: String,
      require: [true, 'please enter the part3'],
      trim: true,
    },
    createdAt: {
      type: Date, 
      expires: 3600, 
      index: true,
      default: Date.now
    }
  },
);

module.exports = mongoose.model('ResetId', resetIdSchema);