const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const ResetId = require("../models/resetId");

dotenv.config();

const VerifyResetToken = async (req, res, next) => {
  const tokenPart3 = req.body.tokenId;
  try {
    if (!tokenPart3) return res.status(400).json({ message: "Invalid Authentication." });

    const tokenData = await ResetId.findOne({ partThree: tokenPart3 });

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
    res.status(500).json({ message: error.message })
  }
}

module.exports = VerifyResetToken;