const jwt = require("jsonwebtoken");

const validNumber = (number, min, max) => {
  return number <= max && number >= min ? true : false;
}

const validAudioType = (audio) => {
  return (audio?.name !== 'none' && (!audio?.name || !audio?.src)) ? false : true;
}

const validateEmail = (email) => {
  const re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  return re.test(email);
}

const filterBody = (props, body) => {
  const keys = Object.entries(body).filter(([k, v]) => props.includes(k));

  return Object.fromEntries(keys);
}

const createObjFromObj = (obj, props) => {
  const result = Object.entries(obj).filter(([key, value]) => props.includes(key)).reduce((newObj, prop) => ({ ...newObj, [prop[0]]: prop[1] }), {});

  return result;
}

const createAcessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "24h" });
};

const createPasswordResetPassword = (payload) => {
  return jwt.sign(payload, process.env.RESET_TOKEN_SECRET, { expiresIn: '1h' });
}

const createRefrishToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30d" })
}

const validateDate = (dayValue) => {
  const [year, month, day] = dayValue?.split('-');
  if (!year || year.length < 4) return 'invalid year';
  else if (!month || month.length < 2 || Number(month) > 12 || Number(month) < 0) return 'invalid month';
  else if (!day || day.length < 2 || Number(day) > 31 || Number(day) < 0) return 'invalid day';
  else return '';
}

module.exports = {
  validNumber,
  validAudioType,
  validateEmail,
  filterBody,
  createObjFromObj,
  createAcessToken,
  createPasswordResetPassword,
  createRefrishToken,
  validateDate
};
