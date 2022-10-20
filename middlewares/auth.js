const jwt = require("jsonwebtoken");

const Auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) return res.status(400).json({ message: "Invalid Authentication." });

    const isCustomAuth = token.length < 500;

    let decodedData;

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);

      req.uerId = decodedData?.sub;
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = Auth;