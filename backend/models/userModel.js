const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userModel = mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: {
    type: String,
    default:
      "https://icon-library.com/images/material-design-user-icon/material-design-user-icon-29.jpg",
  },
});
userModel.methods.validatePassword = async (enteredPswd) => {
  return bcrypt.compare(this.password, enteredPswd);
};
userModel.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
const User = mongoose.model("User", userModel);
module.exports = User;
