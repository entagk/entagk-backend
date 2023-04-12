const User = require("../../models/user.js");
const Tasks = require("../../models/task.js");
const Setting = require("../../models/timerGeneralSetting.js");
const Template = require("../../models/template.js"); 

const deleteAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.userId);

    await Tasks.deleteMany({ userId: req.userId });
    await Setting.deleteOne({ userId: req.userId });
    await Template.deleteMany({ userId: req.userId });

    console.log(String(user?._id));

    res
      .status(200)
      .json({ message: "Deleted account successfully", deleted_id: String(user?._id) || req.userId });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

module.exports = deleteAccount;
