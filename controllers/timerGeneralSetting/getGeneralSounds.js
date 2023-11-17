const cloudinary = require('cloudinary').v2;


// Configuration 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET
});

/**
 * {
                "asset_id": "8ea3800c99d37fcd462e30314bfb4d4f",
                "public_id": "audio/alarm/general/bell ring 5",
                "format": "mp3",
                "version": 1699991847,
                "resource_type": "video",
                "type": "upload",
                "created_at": "2023-11-14T19:57:27Z",
                "bytes": 75885,
                "width": 0,
                "height": 0,
                "folder": "audio/alarm/general",
                "url": "http://res.cloudinary.com/da47rmq7c/video/upload/v1699991847/audio/alarm/general/bell%20ring%205.mp3",
                "secure_url": "https://res.cloudinary.com/da47rmq7c/video/upload/v1699991847/audio/alarm/general/bell%20ring%205.mp3",
                "is_audio": true
            }
 * @param {*} req 
 * @param {*} res 
 */

const getGeneralSounds = async (req, res) => {
  const { type } = req.params;
  console.log(type);
  try {
    const folder = `audio/${type}/general/`;
    const { resources } = await cloudinary.api.resources({
      type: 'upload',
      resource_type: "video",
      format: 'mp3',
      prefix: folder
    });

    res.status(200).json({
      files: resources.map(
        (resource) => ({ src: resource.secure_url, name: resource.public_id.split(folder)[1].replace("-", " ") })
      ),
      total: resources.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = getGeneralSounds;
