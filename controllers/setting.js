const Setting = require("./../models/setting");

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

      if (typeof time !== 'object' && time) return res.status(400).json({ message: "The time should be at this format {PERIOD: ---, SHORT: ---, LONG: ---}." })

      if (
        (typeof alarmType !== 'object' && alarmType) ||
        (typeof tickingType !== 'object' && tickingType) ||
        (typeof clickType !== 'object' && clickType)
      )
        return res.status(400).json({ message: "The sound type should be contines name and src." });


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