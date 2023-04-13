const cloudinary = require('cloudinary').v2;
const File = require('../../models/file');
const User = require('../../models/user');

// Configuration 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET
});

const Upload = async (req, res) => {
  try {
    const file = req.file;
    const folder = req._parsedUrl.pathname;
    const user = req.user;
    const options = { folder: `${folder}/${user._id.toString()}`, tags: [user._id.toString()] };

    if (folder.includes('avatar')) {
      options.width = 150;
      options.height = 150;
      if (user.avatar) {
        const oldAvatar = await File.findOne({ path: user.avatar })
        cloudinary.api.delete_resources([oldAvatar?.name], (result) => {
          console.log(result);
        })
      }
    }

    // Upload
    if (file?.mimetype.includes('image')) {
      options.format = 'webp';
      options.crop = "fill";
    } else {
      options.format = 'mp3';
      options.resource_type = 'raw';
    }
    const result = await cloudinary.uploader.upload(file.path, options);
    console.log(result);

    const saved = await File.create({
      name: result.public_id,
      type: result.format,
      size: result.bytes,
      path: result.secure_url,
      userId: user._id.toString()
    });

    if (folder.includes('avatar')) {
      const userUpdate = await User.findByIdAndUpdate(user._id.toString(), { avatar: saved.path }, { new: true }).select('-password');

      res.status(200).json({ message: "The avatar has been changed successfully.", user: userUpdate });
    } else {
      res.status(200).json({ file_id: saved._id });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = Upload;
