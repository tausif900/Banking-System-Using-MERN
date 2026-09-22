const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const { sendRegistrationEmail } = require("../services/email.service");

/**
 *
 * - user register controller
 * - POST auth/register
 */

const userRegistration = async (req, res) => {
  const { email, name, password } = req.body;

  // check if email is already exists or not

  const isEmailExist = await userModel.findOne({ email: email });

  if (isEmailExist) {
    return res
      .status(422)
      .json({ message: "User already exist", status: "failed" });
  }

  const user = await userModel.create({ email, name, password });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("token", token);

  res.status(201).json({
    message: "User Registration Successfully",
    user: { _id: user._id, email: user.email, name: user.name },
  });
};

/**
 *
 * - user login controller
 * - POST auth/login
 */

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    res.status(401).json({
      message: "User not Found with this email or may be your email is INVALID",
    });
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) {
    res.status(401).json({
      message: "Password id INVALID",
    });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("token", token);

  res.status(200).json({
    message: "User LoggedIn Successfully",
    user: { _id: user._id, email: user.email, name: user.name },
  });

  await sendRegistrationEmail(user.email, user.name);
};

module.exports = { userRegistration, userLogin };
