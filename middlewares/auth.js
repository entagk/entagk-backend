const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("../models/user");

dotenv.config();

const Auth = async (req, res, next) => {
  try {
    let token;
    if (req?.headers?.authorization) {
      token = req?.headers?.authorization?.split(" ")[1];
    }

    if (!token)
      return res.status(401).json({ message: "Invalid Authentication." });

    const isCustomAuth = token.length < 500;

    const tokenValidateion = jwt.decode(token);
    if (tokenValidateion?.exp * 1000 < new Date().getTime()) {
      return res.status(401).json({ message: "Invalid Authentication and jwt expired" });
    }

    let decodedData, userId;

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);

      userId = decodedData?.sub;
    }

    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(401).json({ message: "Invalid Authentication" });

    const user = await User.findById(userId).select("-password") || await User.findOne({ email: decodedData.email }).select("-password");

    if (!user)
      return res.status(404).json({ message: "user not found" });

    req.user = user;

    if (user.totalFocusDay > 0 &&
      Math.ceil(((new Date(new Date().toJSON().split('T')[0]) - new Date(new Date(user?.updatedAt).toJSON().split("T")[0])) / 1000 / 60 / 60 / 24)) > 1) {
      req.user = await User.findByIdAndUpdate(user._id, { totalFocusDay: 0 }, { new: true });
    }

    next();
  } catch (error) {
    console.log(error);
    if (error.name !== 'JsonWebTokenError') {
      res.status(500).json({ message: error.message, from: "Auth.js" });
    } else {
      res.status(401).json({ message: error.message, error });
    }
  }
}

module.exports = Auth;
