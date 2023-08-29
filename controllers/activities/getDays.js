const ActiveDay = require('../../models/active');
const { validateDate } = require('../../utils/helper');

const calcDifferent = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const different = (endDate - startDate) / 1000 / 60 / 60 / 24;
  return different;
}

const calcDays = (start, end, different) => {
  const days = [start, end,];
  for (let i = 1; i < different; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    days.push(date.toJSON().split('T')[0]);
  }

  return { days: days };
}

const getDays = async (req, res) => {
  try {
    const { start, end } = req.query;
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (!start && !end) return res.status(400).json({ message: "Please, enter the start and the end days" });

    const validateStartDate = validateDate(start);
    const validateEndDate = validateDate(end);

    if (validateStartDate) return res.status(400).json({ message: validateStartDate })
    if (validateEndDate) return res.status(400).json({ message: validateEndDate })

    if (start === end) {
      const dayData = await ActiveDay.findOne({ day: start, userId: req.user._id.toString() });
      const daysData = dayData === null ? [] : [dayData];

      res.status(200).json(daysData);
    } else {
      const different = calcDifferent(start, end);
      if (different < 0) {
        return res.status(400).json({ message: 'Invalid start and end days' });
      } else if (different > 31) {
        return res.status(400).json({ message: "Sorry, the limit is 31 days." });
      } else if (
        startDate.getMonth() === endDate.getMonth() &&
        startDate.getDate() === new Date(endDate.setDate(endDate.getDate() + 1)).getDate()
      ) {
        const monthRegExp = new RegExp(start.slice(0, 7));

        const daysData = await ActiveDay.find({
          day: monthRegExp,
          userId: req.user._id.toString()
        })

        res.status(200).json(daysData);
      } else {
        const days = calcDays(start, end, different);

        const daysData = await ActiveDay
          .find
          (
            {
              day: { $in: days.days },
              userId: req.user._id.toString()
            }
          );

        res.status(200).json(daysData);
      }

    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error?.message })
  }
}

module.exports = getDays;
