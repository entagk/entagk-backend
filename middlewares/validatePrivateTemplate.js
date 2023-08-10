const validatePrivateTemplate = async (req, res, next) => {
  try {
    if (req.oldTemplate.userId !== req.user._id.toString() && req.oldTemplate.visibility) return res.status(405).json({ message: "Not allow for you." });
    
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = validatePrivateTemplate;
