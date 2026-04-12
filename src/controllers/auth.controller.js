const userModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
const emailService = require('../services/email.service')
const tokenBlackListModel = require('../model/tokenBlackList.model')
/**
 * - register user
 * - POST /api/auth/register
 */
async function userRegisterController(req, res) {
  const { email, password, name } = req.body;

  const isExist = await userModel.findOne({
    email: email,
  });
  if (isExist) {
    return res.status(422).json({
      message: "User already exists with the given email",
      status: "failed",
    });
  }

  const user = await userModel.create({
    email,
    name,
    password,
  });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // Only over HTTPS
    sameSite: "Strict",
  });

  res.status(201).json({
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
  });

  await emailService.sendRegisterationMail(user.email, user.name);
}

async function userLoginController(req, res) {
  const { name, email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({
      message: "User doesnt exist, please register",
    });
  }

  const isValidPassword = await user.comparePassword(password);

  if (!isValidPassword) {
    return res.status(401).json({
      message: "Password is incorrect",
    });
  }
  
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // Only over HTTPS
    sameSite: "Strict",
  });

  res.status(200).json({
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
  });
}

/**
 * - User Logout Controller
 * - POST /api/auth/logout
  */
async function userLogoutController(req, res) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]

    if (!token) {
        return res.status(200).json({
            message: "User logged out successfully"
        })
    }

    await tokenBlackListModel.create({
        token: token
    })

    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully"
    })

}


module.exports = {
    userRegisterController,
    userLoginController,
    userLogoutController
}