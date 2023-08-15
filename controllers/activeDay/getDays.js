const ActiveDay = require('../../models/active');
const { validateDate } = require('../../utils/helper');

const calcDays = (start, end, res) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const different = (endDate - startDate) / 1000 / 60 / 60 / 24;
  if (different < 0) {
    res.status(400).json({ message: 'Invalid start and end days' });
  } else if (different === 1) {
    return [start, end];
  } else {
    const days = [start, end,];
    for (let i = 1; i < different; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      days.push(date.toJSON().split('T')[0]);
    }

    return days;
  }
}

const getDays = async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start && !end) res.status(400).json({ message: "Please, enter the start and the end days" });

    const validateStartDate = validateDate(start);
    const validateEndDate = validateDate(end);

    if (validateStartDate) res.status(400).json({ message: validateStartDate })
    if (validateEndDate) res.status(400).json({ message: validateEndDate })

    if (start === end) {
      const dayData = await ActiveDay.findOne({ day: start, userId: req.user._id.toString() });

      res.status(200).json([dayData]);
    } else {
      const days = calcDays(start, end);
      const daysData = await ActiveDay
        .find
        (
          {
            day: { $in: days },
            userId: req.user._id.toString()
          }
        );

      console.log(days);
      console.log(daysData);

      res.status(200).json(daysData);
    }

  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error?.message })
  }
}

module.exports = getDays;
