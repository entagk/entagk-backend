const getOne = async (req, res) => {
  try {
    const template = req.oldTemplate;

    res.status(200).json(template);
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

module.exports = getOne;
