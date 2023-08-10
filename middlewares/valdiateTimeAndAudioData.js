const { validNumber, validAudioType } = require("./../utils/helper");

// time: {
//   type: Object,
//   default: {
//     ["PERIOD"]: 1500,
//     ["SHORT"]: 300,
//     ["LONG"]: 900,
//   }
// },
// autoBreaks: {
//   type: Boolean,
//   default: false
// },
// autoPomodors: {
//   type: Boolean,
//   default: false
// },
// autoStartNextTask: {
//   type: Boolean,
//   default: false
// },
// longInterval: {
//   type: Number,
//   default: 4
// },
// alarmType: {
//   type: Object,
//   default: {
//     name: "alarm 1",
//     src: 'sounds/alarm/1.mp3'
//   }
// },
// alarmVolume: {
//   type: Number,
//   default: 50,
// },
// alarmRepet: {
//   type: Number,
//   default: 0
// },
// tickingType: {
//   type: Object,
//   default: {
//     name: "tricking 1",
//     src: "sounds/tricking/1.mp3"
// }

const ValidateTimeData = async (req, res, next) => {
  try {
    const {
      time,
      autoBreaks,
      autoPomodors,
      autoStartNextTask,
      longInterval,
      alarmType,
      alarmVolume,
      tickingType,
      tickingVolume,
      clickType,
      clickVolume
    } = req.body;

    if (
      (typeof time !== 'object' ||
        !time["PERIOD"] ||
        !time["SHORT"] ||
        !time["LONG"] ||
        !validNumber(time["PERIOD"], 1, 3600) ||
        !validNumber(time["SHORT"], 1, 3600) ||
        !validNumber(time["LONG"], 1, 3600)
      ) && time
    ) return res.status(400).json({
      errors: {
        time: "The time should be at this format {PERIOD: ---, SHORT: ---, LONG: ---} with positive numbers"
      }
    })

    if (typeof autoBreaks !== 'boolean' && autoBreaks)
      return res.status(400).json({
        errors: {
          autoBreaks: "The property of the autoBreaks is boolean"
        }
      })

    if (typeof autoPomodors !== 'boolean' && autoPomodors)
      return res.status(400).json({
        errors: {
          autoPomodors: "The property of the autoPomodors is boolean"
        }
      })

    if (typeof autoStartNextTask !== 'boolean' && autoStartNextTask)
      return res.status(400).json({
        errors: {
          autoStartNextTask: "The property of the autoStartNextTask is boolean"
        }
      })

    // the volume range 1-100 so we will calculate the validation volume with 
    if ((!validNumber(alarmVolume, 10, 100)) && alarmVolume)
      return res.status(400).json({
        errors: {
          alarmVolume: "invalid alarm volume"
        }
      });

    if ((!validNumber(tickingVolume, 0, 100)) && tickingVolume)
      return res.status(400).json({
        errors: {
          tickingVolume: "invalid ticking volume"
        }
      });

    if ((!validNumber(clickVolume, 0, 100)) && clickVolume)
      return res.status(400).json({
        errors: {
          clickVolume: "invalid click volume"
        }
      });

    if (longInterval < 2 && longInterval)
      return res.status(400).json({
        errors: {
          longInterval: "The long interval must be more than 2"
        }
      })

    if ((!validAudioType(alarmType) && alarmType))
      return res.status(400).json({
        errors: {
          alarmType: "The sound type should be contines name and src."
        }
      });

    if (
      (!validAudioType(tickingType) && tickingType))
      return res.status(400).json({
        errors: {
          tickingType: "The sound type should be contines name and src."
        }
      });

    if ((!validAudioType(clickType) && clickType))
      return res.status(400).json({
        errors: {
          clickType: "The sound type should be contines name and src."
        }
      });

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = ValidateTimeData;
