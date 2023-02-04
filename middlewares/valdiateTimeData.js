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
//   type: Boolean,
//   default: false
// },
// tickingType: {
//   type: Object,
//   default: {
//     name: "tricking 1",
//     src: "sounds/tricking/1.mp3"
// }

const validNumber = (number, min, max) => {
  return number < max && number >= min ? true : false;
}

const validAudioType = (audio) => {
  return !audio?.name || !audio?.src ? false : true;
}

const ValidateTimeData = async (req, res, next) => {
  try {
    const { time,
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

    if ((typeof time !== 'object' || !time["PERIOD"] || !time["SHORT"] || !time["LONG"] || !validNumber(time["PERIOD"], 1, 3600) || !validNumber(time["SHORT"], 1, 3600) || !validNumber(time["LONG"], 1, 3600)) && time) return res.status(400).json({ message: "The time should be at this format {PERIOD: ---, SHORT: ---, LONG: ---} with positive numbers" })

    if (typeof autoBreaks !== 'boolean' && autoBreaks) return res.status(400).json({ message: "The property of the autoBreaks is boolean" })
    if (typeof autoPomodors !== 'boolean' && autoPomodors) return res.status(400).json({ message: "The property of the autoPomodors is boolean" })
    if (typeof autoStartNextTask !== 'boolean' && autoStartNextTask) return res.status(400).json({ message: "The property of the autoStartNextTask is boolean" })

    // the volume range 1-100 so we will calculate the validation volume with 
    if (
      ((!validNumber(alarmVolume, 10, 101)) && alarmVolume) ||
      ((!validNumber(tickingVolume, 0, 101)) && tickingVolume) ||
      ((!validNumber(clickVolume, 0, 101)) && clickVolume)
    ) return res.status(400).json({ message: "invalid sound volume" });

    if (longInterval < 2 && longInterval) return res.status(400).json({ message: "The long interval must be more than 2" })

    if (
      (!validAudioType(alarmType) && alarmType) ||
      (!validAudioType(tickingType) && tickingType) ||
      (!validAudioType(clickType) && clickType)
    )
      return res.status(400).json({ message: "The sound type should be contines name and src." });

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = ValidateTimeData;