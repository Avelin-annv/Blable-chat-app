const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const authorize = asyncHandler(async (req, res, next) => {
  console.log("req insiede middleware", req);
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      console.log("token", token);
      const decodedEntry = jwt.verify(token, process.env.JWT_SECRET);
      //add user attribute to req excluding pswd.
      req.user = await User.findById(decodedEntry.id).select("-password");
      next();
    } catch (e) {
      res.status(401);
      throw new Error("Not authorized.");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not authorized.");
  }
});

module.exports = authorize;
