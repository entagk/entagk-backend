const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const ResetId = require("../models/resetId");

dotenv.config();

const VerifyResetToken = async (req, res, next) => {
  try {
    let tokenPart3;
    if(req?.headers?.authorization) {
      tokenPart3 = req?.headers?.authorization?.split(" ")[1];
      console.log(req?.headers?.authorization, tokenPart3);
    }
    
    if (!tokenPart3) return res.status(401).json({ message: "Invalid Authentication." });

    const tokenData = await ResetId.findOne({ partThree: tokenPart3 });
    console.log(tokenData);

    if (!tokenData) return res.status(404).json({ message: 'Expired token, please try set password again.' })

    const realToken = tokenData.partOne + '.' + tokenData.partTwo + '.' + tokenData.partThree;

    const isCustomAuth = realToken.length < 500;

    let decodedData;

    if (realToken && isCustomAuth) {
      decodedData = jwt.verify(realToken, process.env.RESET_TOKEN_SECRET);

      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(realToken);

      req.userId = decodedData?.sub;
    }

    next();
  } catch (error) {
    console.log(error);
    if(error.name !== 'JsonWebTokenError') {
      res.status(500).json({ message: error.message });
    } else {
      res.status(401).json({ message: error.message, error });
    }
  }
}

module.exports = VerifyResetToken;
