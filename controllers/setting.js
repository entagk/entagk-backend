const SettingControllers = {
  funcName: async (req, res) => {
    try {

    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },
};

module.exports = SettingControllers;