const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const Auth = (req, res, next) => {
  try {
    let token;
    if (req?.headers?.authorization) {
      token = req?.headers?.authorization?.split(" ")[1];
    }

    if (!token) return res.status(401).json({ message: "Invalid Authentication." });

    const isCustomAuth = token.length < 500;

    console.log(token, req?.headers?.authorization);

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
    console.log(error);
    if (error.name !== 'JsonWebTokenError') {
      res.status(500).json({ message: error.message, from: "Auth.js", token });
    } else {
      res.status(401).json({ message: error.message, error });
    }
  }
}

module.exports = Auth;