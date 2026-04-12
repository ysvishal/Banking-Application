const userModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
const tokenBlackListModel = require("../model/tokenBlackList.model")
async function authMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(402).json({
      message: "Unauthorized acces, token is missing",
    });
  }
  const isBlacklisted = await tokenBlackListModel.findOne({
    token: token,
  });

  if (isBlacklisted) {
    return res.status(401).json({
      message: "Unauthorized access, token is invalid",
    });
  }

  
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized access, user not found",
      });
    }

    req.user = user;

    next();
  } catch (e) {
    return res.status(402).json({
      message: "Unauthorized access, token is invalid",
    });
  }
}
async function authSystemMiddleware(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if(!token) {
        return res.status(402).json({
          message: "Unauthorized acces, token is missing",
        });
    }

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await userModel.findById(decoded.userId).select('+systemUser')
        
        if (!user) {
          return res.status(401).json({
            message: "Unauthorized access, user not found",
          });
        }

        if (!user.systemUser) {
          return res.status(403).json({
            message: "Forbidden access",
          });
        }

        req.user = user
        next()
    }
    catch(e) {
        return res.status(401).json({
            message: "Unauthorized access, token is missing"
        })
    }
}

module.exports = {
  authMiddleware,
  authSystemMiddleware
};
