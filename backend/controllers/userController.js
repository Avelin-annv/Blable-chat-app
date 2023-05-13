const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const getAuthToken = require("../config/getAuthToken");
const registerUser = asyncHandler(async (req, res) => {
  const { userName, email, password, profilePic } = req.body;
  if (!userName || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the required fields.");
  }
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User with this email Id already exists.");
  } else {
    const user = await User.create({ userName, email, password, profilePic });
    if (user) {
      res.status(201).json({
        _id: user._id,
        userName: user.userName,
        email: user.email,
        profilePic: user.profilePic,
        token: getAuthToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Failed to create a new user.");
    }
  }
});
const authenticateUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && user.validatePassword(password)) {
    res.status(201).json({
      _id: user._id,
      userName: user.userName,
      email: user.email,
      profilePic: user.profilePic,
      token: getAuthToken(user._id),
    });
  } else {
    throw new Error("Please enter a valid email and password");
  }
});
const getAllUsers = asyncHandler(async (req, res) => {
  const searchQuery = req.query.search
    ? {
        $or: [
          { userName: { $regex: req.query.search, $options: "i" } },
          {
            email: { $regex: req.query.search, $options: "i" },
          },
        ],
      }
    : {};
  //we need to exclude current user.
  const searchResult = await User.find(searchQuery).find({
    _id: { $ne: req.user._id },
  });
  res.send(searchResult);
});
module.exports = { registerUser, authenticateUser, getAllUsers };
