const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
};

const verifyRefreshToken = (req, res, next) => {
  const refreshToken = req.body.refreshToken; 
  if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required." });
  }
  try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      req.user = decoded; 
      next();
  } catch (err) {
      res.status(400).json({ message: "Invalid refresh token." });
  }
};

module.exports = { verifyToken, verifyRefreshToken };
