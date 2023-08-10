const TimerSetting = require('../../models/timerGeneralSetting');

const getSetting = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const settingData = await TimerSetting.findOne({ userId: userId });

    res.status(200).json(settingData);
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = getSetting;
