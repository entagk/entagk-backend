const cloudinary = require('cloudinary').v2;
const File = require('../../models/file');

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
    const options = { folder };

    if (folder === 'avatar') {
      options.width = 150;
      options.height = 150;
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

    const saved = await File.create({
      name: result.public_id,
      type: result.format,
      size: result.bytes,
      path: result.secure_url,
      userId: req.userId
    });

    res.status(200).json({ id: saved._id, name: saved.name });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = Upload;
