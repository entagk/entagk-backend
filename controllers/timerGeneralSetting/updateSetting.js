const TimerSetting = require('../../models/timerGeneralSetting');
const { validNumber, filterBody } = require("../../utils/helper");

const updateSetting = async (req, res) => {
  try {
    const userId = req.userId;
    const props = `
    format,
    time,
    autoBreaks,
    autoPomodors,
    autoStartNextTask,
    longInterval,
    alarmType,
    alarmVolume,
    alarmRepet,
    tickingType,
    tickingVolume,
    clickType,
    clickVolume,
    focusMode,
    notificationType,
    notificationInterval`.split(",").map((e) => e.trim());
    const body = filterBody(props, req.body);

    if (Object.keys(req.body).length === 0)
      return res.status(400).json({ message: "No valid data sended" });

    if (body.format && ["analog", "digital"].indexOf(body.format?.toLocaleLowerCase()) < 0)
      return res.status(400).json({ message: "invalid timer format" });

    if (typeof body.focusMode !== 'boolean' && body.focusMode)
      return res.status(400).json({ message: "The property of the focusMode is boolean" })

    if (["last", "every"].indexOf(body.notificationType?.toLocaleLowerCase()) < 0 && body.notificationType)
      return res.status(400).json({ message: "Choose the notification type from one of last or every" });

    if (body.notificationInterval && !validNumber(body.notificationInterval, 1, 60))
      return res.status(400).json({ message: "Invalid notification interval between 1 and 60" });

    const oldSetting = await TimerSetting.findOne({ userId });
    const newSetting = Object.assign(oldSetting, {
      time: Object.assign(oldSetting.time, body.time),
      ...body
    });

    const updatedSetting = await TimerSetting.findOneAndUpdate({ userId }, newSetting, { new: true });

    res.status(200).json(updatedSetting);
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = updateSetting;
