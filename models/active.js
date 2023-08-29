const mongoose = require('mongoose');

const activeSchema = new mongoose.Schema(
  {
    types: {
      type: Array,// [{id, name, totalMins}]
      default: []
    },
    templates: {
      type: Array,// [{id, name, totalMins}]
      default: []
    },
    tasks: {
      type: Array,// [{id, name, totalMins}]
      default: []
    },
    totalMins: {
      type: Number,
      default: 0
    },
    userId: {
      type: String,
      require: [true, 'please enter the userId'],
      trim: true,
    },
    day: {
      type: String,
      default: new Date().toJSON().split('T')[0]
    }
  }, {
  timestamps: true,
}
)

module.exports = mongoose.model("ActiveDay", activeSchema);
