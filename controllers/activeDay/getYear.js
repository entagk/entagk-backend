const ActiveDay = require('../../models/active');

const getYear = async (req, res) => {
  try {
    const { year } = req.query;

    if (year.length !== 4) {
      return res.status(400).json({ message: "Invalid year" });
    }

    const yearRegex = new RegExp(year, 'i');

    const daysData = await ActiveDay.find(
      { 
        userId: req.user._id.toString(), 
        day: yearRegex 
      }
    ).select('day userId _id totalMins');

    res.status(200).json(daysData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error?.message });
  }
}

module.exports = getYear;
