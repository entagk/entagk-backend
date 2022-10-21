const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const Auth = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  try {

    if (!token) return res.status(400).json({ message: "Invalid Authentication." });

    const isCustomAuth = token.length < 500;

    let decodedData;

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);

      req.userId = decodedData?.sub;
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message, from: "Auth.js", token });
    console.error(error); 
  }
}

module.exports = Auth;