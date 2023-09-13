const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("../models/user");

dotenv.config();

const Auth = async (ws, req, next) => {
  try {
    let token, error = 0;
    if (req?.headers?.authorization) {
      token = req?.headers?.authorization?.split(" ")[1];
    }

    if (!token) {
      error = 1;
      ws.close(1013, JSON.stringify({ message: "Invalid Authentication" }));
    }

    const isCustomAuth = token.length < 500;

    const tokenValidateion = jwt.decode(token);
    if (tokenValidateion?.exp * 1000 < new Date().getTime()) {
      error = 1;
      ws.close(1013, JSON.stringify({ message: "Invalid Authentication and jwt expired" }));
    }

    let decodedData, userId;

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);

      userId = decodedData?.sub;
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      error = 1;
      ws.close(1013, JSON.stringify({ message: "Invalid Authentication." }));
    }

    const user = await User.findById(userId).select("-password") || await User.findOne({ email: decodedData.email }).select("-password");

    if (!user) {
      error = 1;
      ws.close(1013, JSON.stringify({ message: "user not found" }));
    }

    req.user = user;

    if (!error) next();
  } catch (error) {
    console.log(error);
    ws.close(1011, error.message);
  }
}

module.exports = Auth;
