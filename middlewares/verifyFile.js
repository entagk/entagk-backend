const VerifyFile = async (req, res, next) => {
  try {
    const file = req.file;

    if (file.size > 50 * 1024 * 1024) {
      return res.status(400).json({ message: "This file size is larg than 10Mb" })
    }

    if (req._parsedUrl.path.includes('image')) {
      if (!file.mimetype.includes('image')) {
        return res.status(400).json({ message: "This is not image file" })
      }
    } else if (req._parsedUrl.path.includes('audio')) {
      if (!file.mimetype.includes('audio')) {
        return res.status(400).json({ message: "This is not audio file" })
      }
    } else {
      return res.status(400).json({ message: "This is unsupported file" })
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = VerifyFile;
