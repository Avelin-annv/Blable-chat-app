const mongoose = require("mongoose");
const userModel = mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  profilePic: {
    type: String,
    default:
      "https://icon-library.com/images/material-design-user-icon/material-design-user-icon-29.jpg",
  },
});
const User = mongoose.model("User", userModel);
module.exports = User;
