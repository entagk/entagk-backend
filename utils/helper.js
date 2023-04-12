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

const createAcessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "24h" });
};

const createPasswordResetPassword = (payload) => {
  return jwt.sign(payload, process.env.RESET_TOKEN_SECRET, { expiresIn: '1h' });
}

const createRefrishToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30d" })
}

module.exports = { validNumber, validAudioType, validateEmail, filterBody, createAcessToken, createPasswordResetPassword, createRefrishToken };
