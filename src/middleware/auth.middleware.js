const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const tokenBlacklistModel = require("../models/blacklist.model");

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split[1];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized access, token is missing",
    });
  }

  const isBlacklisted = await tokenBlacklistModel.findOne({ token });

  if (isBlacklisted) {
    return res
      .status(401)
      .json({ message: "unauthorized access, token is invalid" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.userId);
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized access, token is invalid",
    });
  }
};

const authSystemUserMiddleware = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split[1];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized access, token is missing",
    });
  }

  const isBlacklisted = await tokenBlacklistModel.findOne({ token });

  if (isBlacklisted) {
    return res
      .status(401)
      .json({ message: "unauthorized access, token is invalid" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.userId).select("+systemUser");
    if (!user.systemUser) {
      return res
        .status(403)
        .json({ message: "Forbidden Access, not a system User" });
    }
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized access, token is invalid",
    });
  }
};

module.exports = { authMiddleware, authSystemUserMiddleware };
