const User = require("../../models/user.js");
const Tasks = require("../../models/task.js");
const Setting = require("../../models/timerGeneralSetting.js");
const Template = require("../../models/template.js");
const File = require("../../models/file.js");

const cloudinary = require('cloudinary').v2;

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const user = await User.findByIdAndDelete(userId);

    // delete user data at MongoDB
    await Tasks.deleteMany({ userId: userId });
    await Setting.deleteOne({ userId: userId });
    await Template.deleteMany({ userId: userId });
    const files = await File.deleteMany({ userId: userId });

    console.log(files);

    // delete user files
    await cloudinary.api.delete_resources_by_tag(userId, { resource_type: 'raw' });
    await cloudinary.api.delete_resources_by_tag(userId);

    if (files.deletedCount > 0) {
      await cloudinary.api.delete_folder(`/image/avatar/${userId}`);
      await cloudinary.api.delete_folder(`/audio/ticking/${userId}`);
      await cloudinary.api.delete_folder(`/audio/click/${userId}`);
      await cloudinary.api.delete_folder(`/audio/alarm/${userId}`);
    }

    res
      .status(200)
      .json({
        message: "Deleted account successfully",
        deleted_id: user?._id.toString() || userId,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = deleteAccount;
