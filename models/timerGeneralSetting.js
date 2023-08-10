const mongoose = require("mongoose");

const timerSettingSchema = new mongoose.Schema(
  {
    format: {
      type: String,
      require: [true, "please enter the timer format"],
      default: "analog"
    },
    time: {
      type: Object,
      default: {
        ["PERIOD"]: 1500,
        ["SHORT"]: 300,
        ["LONG"]: 900,
      }
    },
    autoBreaks: {
      type: Boolean,
      default: false
    },
    autoPomodors: {
      type: Boolean,
      default: false
    },
    autoStartNextTask: {
      type: Boolean,
      default: false
    },
    longInterval: {
      type: Number,
      default: 4
    },
    alarmType: {
      type: Object,
      default: {
        name: "alarm 1",
        src: 'sounds/alarm/1.mp3'
      }
    },
    alarmVolume: {
      type: Number,
      default: 50,
    },
    alarmRepet: {
      type: Number,
      default: 0
    },
    tickingType: {
      type: Object,
      default: {
        name: "tricking 1",
        src: "sounds/tricking/1.mp3"
      }
    },
    tickingVolume: {
      type: Number,
      default: 50,
    },
    clickType: {
      type: Object,
      default: {
        name: "can opening pop",
        src: "sounds/click/can-opening-pop-101856.mp3"
      },
    },
    clickVolume: {
      type: Number,
      default: 50,
    },
    focusMode: {
      type: Boolean,
      default: false
    },
    notificationType: {
      type: String,
      default: "last",
    },
    notificationInterval: {
      type: Number,
      default: 5,
    },
    userId: {
      type: String,
      require: [true, "You should enter the userId."]
    },
    applyTaskSetting: {
      type: Boolean,
      default: true
    }
  },
  {
    timeseries: true,
  }
);

module.exports = mongoose.model("Setting", timerSettingSchema);
