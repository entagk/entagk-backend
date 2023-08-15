const ActiveDay = require('../../models/active');

const { validateDate } = require('../../utils/helper');

const getDay = async (req, res) => {
  try {
    const { day } = req.params;

    // 1. validate the day
    const validatedDate = validateDate(day);
    if (validatedDate) res.status(400).json({ message: validatedDate });
    // 2. get the day data
    const dayData = await ActiveDay.findOne({ day, userId: req.user._id.toString() });

    res.status(200).json(dayData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error?.message });
  }
}

module.exports = getDay;
