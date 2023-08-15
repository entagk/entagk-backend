const ActiveDay = require('../../models/active');

const validateDay = (dayValue) => {
  const [year, month, day] = dayValue.split('-');
  if (!year || year.length < 4) return 'invalid year';
  else if (!month || month.length < 2 || Number(month) > 12 || Number(month) < 0) return 'invalid month';
  else if (!day || day.length < 2 || Number(day) > 31 || Number(day) < 0) return 'invalid day';
  else return '';
}

const getDay = async (req, res) => {
  try {
    const { day } = req.params;

    // 1. validate the day
    if (validateDay(day)) return res.status(400).json({ message: validateDay(day) });

    const dayData = await ActiveDay.findOne({ day, userId: req.user._id.toString() });

    res.status(200).json(dayData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error?.message });
  }
}

module.exports = getDay;
