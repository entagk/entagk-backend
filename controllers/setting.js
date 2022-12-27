const Setting = require("./../models/setting");

const validNumber = (number, min, max) => {
  return number < max && number >= min ? true : false;
}

const validAudioType = (audio) => {
  return !audio?.name || !audio?.src ? false: true;
}

const SettingControllers = {
  getSetting: async (req, res) => {
    try {
      const userId = req.userId;

      const settingData = await Setting.findOne({ userId: userId });

      res.status(200).json(settingData);
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },
  update: async (req, res) => {
    try {
      const userId = req.userId;
      const {
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
        notificationInterval
      } = req.body;

      if (Object.keys(req.body).length === 0) return res.status(400).json({ message: "No valid data sended" });

      if (format && ["analog", "digital"].indexOf(format?.toLocaleLowerCase()) < 0) return res.status(400).json({ message: "invalid timer format" });

      if (typeof focusMode !== 'boolean' && focusMode) return res.status(400).json({ message: "The property of the focusMode is boolean" })

      if (["last", "every"].indexOf(notificationType?.toLocaleLowerCase()) < 0 && notificationType) return res.status(400).json({ message: "Choose the notification type from one of last or every" });

      if (notificationInterval && !validNumber(notificationInterval, 1, 60)) return res.status(400).json({ message: "Invalid notification interval between 1 and 60" });

      const oldSetting = await Setting.findOne({ userId });
      const newSetting = Object.assign(oldSetting, {
        format,
        time: Object.assign(oldSetting.time, time),
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
        notificationInterval
      });

      const updatedSetting = await Setting.findOneAndUpdate({ userId }, newSetting, { new: true });

      res.status(200).json(updatedSetting);
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },
};

module.exports = SettingControllers;