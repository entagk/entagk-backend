const jwt = require("jsonwebtoken");

const validNumber = (number, min, max) => {
  return number <= max && number >= min ? true : false;
}

const validAudioType = (audio) => {
  return !audio?.name || !audio?.src ? false : true;
}

const validateEmail = (email) => {
  const re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  return re.test(email);
}

const createAcessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "16h" });
};

const createPasswordResetPassword = (payload) => {
  return jwt.sign(payload, process.env.RESET_TOKEN_SECRET, { expiresIn: '1h' });
}

const createRefrishToken = (payload) => {
  return jwt.sign(payload, process.env.REFRISH_TOKEN_SECRET, { expiresIn: "7d" })
}


module.exports = { validNumber, validAudioType, validateEmail, createAcessToken, createPasswordResetPassword, createRefrishToken };
